import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Share2, Download, Copy, Check, Sparkles, 
  Heart, ArrowRight, RefreshCw, X, ShieldAlert, 
  Scale, Flame, Apple, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import useDietStore from '../../store/useDietStore';
import useUserStore from '../../store/useUserStore';
import useAuthStore from '../../store/useAuthStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import useDailyLogStore from '../../store/useDailyLogStore';
import { getTodayStr, getDayName } from '../../utils/calculations';
import { syncDietPlanToCloud } from '../../lib/supabaseSync';
import { 
  generateDietSharePayload, 
  parseDietShareCode, 
  scaleDietPlan, 
  calculatePlanDailyStats 
} from '../../lib/partnerDietService';

export default function PartnerDietModal({ isOpen, onClose, initialCode = '' }) {
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { weeklyPlan, setWeeklyPlan, setDayMeals, partner, setPartner } = useDietStore();
  const { weeklyPlan: workoutWeeklyPlan } = useWorkoutStore();
  const { syncPlan } = useDailyLogStore();

  const todayStr = getTodayStr();
  const todayDayOfWeek = new Date().getDay();

  const [activeTab, setActiveTab] = useState(initialCode ? 'import' : 'share');
  const [copied, setCopied] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Import state
  const [importInput, setImportInput] = useState(initialCode || '');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedPartnerPlan, setParsedPartnerPlan] = useState(null);
  
  // Scaling mode: 'smart' (calorie-adjusted for male/female) vs 'exact' (1:1 identical)
  const [scaleMode, setScaleMode] = useState('smart');
  const [appliedSuccessMsg, setAppliedSuccessMsg] = useState('');

  // Generate share data whenever modal opens on share tab
  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      generateDietSharePayload(weeklyPlan, user, profile)
        .then((data) => {
          setShareData(data);
          setIsGenerating(false);
        })
        .catch(() => setIsGenerating(false));
    }
  }, [isOpen, weeklyPlan, user, profile]);

  // If initialCode was passed (e.g. from URL parameter), parse immediately
  useEffect(() => {
    if (initialCode) {
      setImportInput(initialCode);
      handleParseCode(initialCode);
      setActiveTab('import');
    }
  }, [initialCode]);

  const handleCopyLink = async () => {
    if (!shareData?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareData.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
    }
  };

  const handleCopyCode = async () => {
    if (!shareData?.fullCode) return;
    try {
      await navigator.clipboard.writeText(shareData.fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
    }
  };

  const handleWhatsAppShare = () => {
    if (!shareData?.shareUrl) return;
    const partnerName = user?.name || 'Your Gym Buddy';
    const text = `Hey! 🏋️‍♂️ ${partnerName} shared their FitForge gym diet plan with you!\n\nOpen this link to view and sync our diet together:\n${shareData.shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setImportInput(text);
        handleParseCode(text);
      }
    } catch (e) {
      // Browser permission error
    }
  };

  const handleParseCode = async (textToParse) => {
    const raw = textToParse || importInput;
    if (!raw.trim()) return;

    setIsParsing(true);
    setParseError('');
    setParsedPartnerPlan(null);

    const result = await parseDietShareCode(raw);
    setIsParsing(false);

    if (result.success) {
      setParsedPartnerPlan(result.payload);
    } else {
      setParseError(result.error || 'Failed to parse diet code.');
    }
  };

  const handleApplyDiet = (targetMode = 'all') => {
    if (!parsedPartnerPlan?.weeklyPlan) return;

    const sourceCalories = parsedPartnerPlan.avgCalories || parsedPartnerPlan.owner?.targetCalories || 2000;
    const targetCalories = Number(profile?.targetCalories) || 2000;

    let finalWeeklyPlan;
    if (scaleMode === 'smart') {
      finalWeeklyPlan = scaleDietPlan(parsedPartnerPlan.weeklyPlan, sourceCalories, targetCalories);
    } else {
      finalWeeklyPlan = JSON.parse(JSON.stringify(parsedPartnerPlan.weeklyPlan));
    }

    if (targetMode === 'all') {
      setWeeklyPlan(finalWeeklyPlan);
      
      // Sync cloud for all 7 days if Supabase is active
      for (let day = 0; day < 7; day++) {
        syncDietPlanToCloud(null, day, finalWeeklyPlan[day]?.meals || []);
      }

      // Sync today's log if today has meals
      const todayWorkout = workoutWeeklyPlan?.[todayDayOfWeek] || { exercises: [] };
      syncPlan(todayStr, todayWorkout, { meals: finalWeeklyPlan[todayDayOfWeek]?.meals || [] });

      setAppliedSuccessMsg(`🎉 Successfully applied full week diet from ${parsedPartnerPlan.owner?.name || 'partner'}!`);
    } else {
      // Today only
      const todayMeals = finalWeeklyPlan[todayDayOfWeek]?.meals || [];
      setDayMeals(todayDayOfWeek, todayMeals);
      syncDietPlanToCloud(null, todayDayOfWeek, todayMeals);
      
      const todayWorkout = workoutWeeklyPlan?.[todayDayOfWeek] || { exercises: [] };
      syncPlan(todayStr, todayWorkout, { meals: todayMeals });

      setAppliedSuccessMsg(`🎉 Successfully applied today's meals from ${parsedPartnerPlan.owner?.name || 'partner'}!`);
    }

    // Save partner memory
    const partnerInfo = {
      name: parsedPartnerPlan.owner?.name || 'Gym Partner',
      email: parsedPartnerPlan.owner?.email || '',
      gender: parsedPartnerPlan.owner?.gender || '',
      sourceCalories,
      lastSyncedAt: new Date().toISOString(),
      rawCode: importInput,
    };
    setPartner(partnerInfo);

    setTimeout(() => {
      setAppliedSuccessMsg('');
      onClose();
    }, 2000);
  };

  const handleQuickResync = async () => {
    if (!partner?.rawCode) return;
    setIsParsing(true);
    const res = await parseDietShareCode(partner.rawCode);
    setIsParsing(false);
    if (res.success) {
      setParsedPartnerPlan(res.payload);
      setActiveTab('import');
    }
  };

  const handleUnlinkPartner = () => {
    if (window.confirm('Disconnect your gym partner? Your current saved diet will not be deleted.')) {
      setPartner(null);
    }
  };

  if (!isOpen) return null;

  const targetCal = Number(profile?.targetCalories) || 2000;
  const partnerCal = parsedPartnerPlan?.avgCalories || parsedPartnerPlan?.owner?.targetCalories || 2000;
  const calDiff = targetCal - partnerCal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gym Partner Diet Sync">
      <div className="space-y-4">
        {/* Partner Linked Banner (if connected) */}
        {partner && (
          <div className="bg-gradient-to-r from-accent/20 via-dark-800 to-accent2/20 p-3.5 rounded-2xl border border-accent/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-accent/20 text-accent flex items-center justify-center text-lg">
                👫
              </span>
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  Connected with {partner.name}
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
                <div className="text-[10px] text-gray-400">
                  Following the same diet • Synced
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleQuickResync}
                className="text-xs bg-dark-700 hover:bg-dark-600 text-accent font-semibold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                title="Pull latest meals"
              >
                <RefreshCw size={12} /> Sync
              </button>
              <button
                onClick={handleUnlinkPartner}
                className="text-[10px] text-gray-400 hover:text-red-400 p-1.5"
                title="Unlink"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex p-1 bg-dark-900 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'share' 
                ? 'bg-dark-700 text-accent shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Share2 size={15} />
            Share My Diet
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'import' 
                ? 'bg-dark-700 text-accent2 shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Download size={15} />
            Import Partner's Diet
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: SHARE MY DIET */}
        {/* ============================================================== */}
        {activeTab === 'share' && (
          <div className="space-y-4">
            <div className="bg-dark-800/80 p-4 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-white">Your Weekly Diet Plan</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ready to share with your gym buddy / partner
                  </p>
                </div>
                <span className="text-xs bg-accent/15 text-accent font-bold px-2.5 py-0.5 rounded-full">
                  {shareData?.stats?.activeDays || 0} Days Planned
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-dark-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Avg Calories / Day</span>
                  <span className="font-bold text-accent text-sm">
                    {shareData?.stats?.avgCalories || 2000} kcal
                  </span>
                </div>
                <div className="bg-dark-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Total Meals</span>
                  <span className="font-bold text-accent2 text-sm">
                    {shareData?.stats?.totalMeals || 0} meals
                  </span>
                </div>
              </div>
            </div>

            {/* Sharing Action Options */}
            <div className="space-y-2">
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <span>💬</span> Share Directly via WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyLink}
                  className="py-3 bg-dark-700 hover:bg-dark-600 rounded-2xl text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/5 active:scale-95"
                >
                  {copied ? <Check size={16} className="text-accent" /> : <Share2 size={15} />}
                  <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="py-3 bg-dark-700 hover:bg-dark-600 rounded-2xl text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/5 active:scale-95"
                >
                  {copied ? <Check size={16} className="text-accent" /> : <Copy size={15} />}
                  <span>{copied ? 'Code Copied!' : 'Copy Partner Code'}</span>
                </button>
              </div>
            </div>

            {/* How It Works Guide */}
            <div className="bg-dark-900/80 p-3.5 rounded-2xl border border-white/5 space-y-2 text-xs">
              <div className="font-bold text-gray-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-accent" /> How It Works for You & Your Friend:
              </div>
              <ul className="text-gray-400 space-y-1.5 pl-4 list-disc text-[11px] leading-relaxed">
                <li>Send her the link or code on WhatsApp or Instagram.</li>
                <li>When she opens it in FitForge, the app automatically adapts portions for her body weight and calorie goal.</li>
                <li>You both prepare & eat the exact same healthy meals together!</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: IMPORT PARTNER'S DIET */}
        {/* ============================================================== */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            {/* Input area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex justify-between">
                <span>Paste Partner Link or Code:</span>
                <button 
                  type="button" 
                  onClick={handlePasteClipboard} 
                  className="text-accent hover:underline text-[11px]"
                >
                  Paste from Clipboard
                </button>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste FITFORGE-DIET-v1:... or link"
                  value={importInput}
                  onChange={(e) => {
                    setImportInput(e.target.value);
                    if (e.target.value.length > 20) {
                      handleParseCode(e.target.value);
                    }
                  }}
                  className="flex-1 bg-dark-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-accent2"
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => handleParseCode(importInput)}
                  loading={isParsing}
                >
                  Load
                </Button>
              </div>

              {parseError && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <ShieldAlert size={14} /> {parseError}
                </p>
              )}
            </div>

            {/* Parsed Partner Plan Preview */}
            {parsedPartnerPlan && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* Partner Card */}
                <div className="bg-dark-800 p-4 rounded-2xl border border-accent2/30 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-accent2/20 text-accent2 flex items-center justify-center font-bold text-sm">
                        {parsedPartnerPlan.owner?.name?.[0]?.toUpperCase() || 'P'}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-white">
                          {parsedPartnerPlan.owner?.name || 'Gym Buddy'}'s Diet
                        </div>
                        <div className="text-[11px] text-gray-400 capitalize">
                          {parsedPartnerPlan.owner?.gender || 'partner'} • {partnerCal} kcal/day
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] bg-accent2/10 text-accent2 font-bold px-2 py-0.5 rounded-full">
                      Verified Plan
                    </span>
                  </div>

                  <div className="p-2.5 bg-dark-900/70 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Your Personal Target:</span>
                      <span className="font-bold text-accent">{targetCal} kcal/day</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">Calorie Difference:</span>
                      <span className={`font-bold ${calDiff < 0 ? 'text-orange-400' : 'text-accent2'}`}>
                        {calDiff > 0 ? `+${calDiff}` : calDiff} kcal
                      </span>
                    </div>
                  </div>
                </div>

                {/* Portion Scaling Mode (Crucial for Guy & Girl Gym Buddies) */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-300">
                    How should portions be adapted for you?
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Option 1: Smart-Scale */}
                    <div
                      onClick={() => setScaleMode('smart')}
                      className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                        scaleMode === 'smart'
                          ? 'bg-accent/15 border-accent text-white'
                          : 'bg-dark-800/80 border-white/5 text-gray-300 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs flex items-center gap-1.5 text-accent">
                          <Sparkles size={14} /> Smart-Scale for My Body Goals (Recommended)
                        </div>
                        {scaleMode === 'smart' && <CheckCircle2 size={16} className="text-accent" />}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        Eat the <strong>exact same meals, ingredients & recipes together</strong>, but food quantities are automatically scaled to meet your {targetCal} kcal goal!
                      </p>
                    </div>

                    {/* Option 2: Exact Mirror */}
                    <div
                      onClick={() => setScaleMode('exact')}
                      className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                        scaleMode === 'exact'
                          ? 'bg-accent2/15 border-accent2 text-white'
                          : 'bg-dark-800/80 border-white/5 text-gray-300 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs flex items-center gap-1.5 text-accent2">
                          <Scale size={14} /> Exact 1:1 Mirror (Same Grams)
                        </div>
                        {scaleMode === 'exact' && <CheckCircle2 size={16} className="text-accent2" />}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        Copies the exact same gram amounts as your partner without any calorie adjustment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Apply Buttons */}
                <div className="pt-2 space-y-2">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={() => handleApplyDiet('all')}
                  >
                    Apply Diet to Entire Week (Mon - Sun)
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    size="md"
                    onClick={() => handleApplyDiet('today')}
                  >
                    Apply to Today ({getDayName(todayDayOfWeek)}) Only
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Success toast */}
            {appliedSuccessMsg && (
              <div className="p-3 bg-accent/20 border border-accent/40 rounded-xl text-center text-xs text-accent font-bold flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                <span>{appliedSuccessMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
