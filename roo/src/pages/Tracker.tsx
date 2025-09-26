import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dice6, Plus, RotateCcw, BarChart3, History,
  Play, Pause, Square, Trash2, Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DiceRoll {
  id: string;
  value: number;
  timestamp: Date;
  type: 'manual' | 'virtual';
  sessionId: string;
}

interface GameSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  rolls: DiceRoll[];
  isActive: boolean;
}

const Tracker: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [inputMode, setInputMode] = useState<'manual' | 'virtual'>('manual');
  const [manualValue, setManualValue] = useState<string>('');
  const [isRolling, setIsRolling] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Sample data for demonstration
  const [sampleRolls] = useState<DiceRoll[]>([
    { id: '1', value: 6, timestamp: new Date(Date.now() - 300000), type: 'manual', sessionId: 'session1' },
    { id: '2', value: 3, timestamp: new Date(Date.now() - 240000), type: 'virtual', sessionId: 'session1' },
    { id: '3', value: 4, timestamp: new Date(Date.now() - 180000), type: 'manual', sessionId: 'session1' },
    { id: '4', value: 2, timestamp: new Date(Date.now() - 120000), type: 'virtual', sessionId: 'session1' },
    { id: '5', value: 5, timestamp: new Date(Date.now() - 60000), type: 'manual', sessionId: 'session1' },
  ]);

  const frequencyData = [
    { value: 1, count: 5, percentage: 12 },
    { value: 2, count: 8, percentage: 20 },
    { value: 3, count: 12, percentage: 30 },
    { value: 4, count: 6, percentage: 15 },
    { value: 5, count: 4, percentage: 10 },
    { value: 6, count: 5, percentage: 13 },
  ];

  const startNewSession = () => {
    const newSession: GameSession = {
      id: `session_${Date.now()}`,
      startTime: new Date(),
      rolls: [],
      isActive: true,
    };
    setCurrentSession(newSession);
  };

  const endSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        endTime: new Date(),
        isActive: false,
      });
    }
  };

  const addManualRoll = () => {
    const value = parseInt(manualValue);
    if (value >= 1 && value <= 6 && currentSession) {
      const newRoll: DiceRoll = {
        id: `roll_${Date.now()}`,
        value,
        timestamp: new Date(),
        type: 'manual',
        sessionId: currentSession.id,
      };

      setCurrentSession({
        ...currentSession,
        rolls: [...currentSession.rolls, newRoll],
      });
      setManualValue('');
    }
  };

  const rollVirtualDice = async () => {
    if (!currentSession || isRolling) return;

    setIsRolling(true);

    // Simulate dice rolling animation
    const rollDuration = 1500;
    const rollInterval = 100;
    const rolls = Math.ceil(rollDuration / rollInterval);

    for (let i = 0; i < rolls; i++) {
      // Generate random face (1-6)
      const randomFace = Math.floor(Math.random() * 6) + 1;
      // Update display during animation (you would update UI state here)
      await new Promise(resolve => setTimeout(resolve, rollInterval));
    }

    // Final roll
    const finalValue = Math.floor(Math.random() * 6) + 1;

    const newRoll: DiceRoll = {
      id: `roll_${Date.now()}`,
      value: finalValue,
      timestamp: new Date(),
      type: 'virtual',
      sessionId: currentSession.id,
    };

    setCurrentSession({
      ...currentSession,
      rolls: [...currentSession.rolls, newRoll],
    });
    setIsRolling(false);
  };

  const clearSession = () => {
    setCurrentSession(null);
  };

  const exportSession = () => {
    if (!currentSession) return;

    const dataStr = JSON.stringify(currentSession, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `dice_session_${currentSession.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    // Auto-start a session for demo
    if (!currentSession) {
      startNewSession();
    }
  }, []);

  return (
    <div className="tracker-container">
      {/* Background */}
      <div className="tracker-background">
        <div className="dice-pattern">
          {[1, 2, 3, 4, 5, 6].map((value) => (
            <motion.div
              key={value}
              className={`dice-bg dice-${value}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.05, scale: 1 }}
              transition={{ delay: value * 0.1, duration: 0.8 }}
            />
          ))}
        </div>
      </div>

      <div className="tracker-content">
        {/* Header */}
        <motion.div
          className="tracker-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-info">
            <h1 className="tracker-title">Dice Tracker</h1>
            <p className="tracker-subtitle">
              {currentSession?.isActive ? 'Session in progress' : 'Session completed'}
            </p>
          </div>

          <div className="header-actions">
            <motion.button
              className="btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <History size={20} />
              {showHistory ? 'Hide' : 'Show'} History
            </motion.button>

            {currentSession?.isActive ? (
              <motion.button
                className="btn-secondary end-btn"
                onClick={endSession}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Square size={20} />
                End Session
              </motion.button>
            ) : (
              <motion.button
                className="btn-primary"
                onClick={startNewSession}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                New Session
              </motion.button>
            )}

            <motion.button
              className="btn-secondary clear-btn"
              onClick={clearSession}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={20} />
              Clear
            </motion.button>

            <motion.button
              className="btn-secondary export-btn"
              onClick={exportSession}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} />
              Export
            </motion.button>
          </div>
        </motion.div>

        <div className="tracker-main">
          {/* Left Section - Dice Input */}
          <motion.div
            className="input-section"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="section-header">
              <h2>Dice Input</h2>
              <div className="mode-toggle">
                <button
                  className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
                  onClick={() => setInputMode('manual')}
                >
                  Manual
                </button>
                <button
                  className={`mode-btn ${inputMode === 'virtual' ? 'active' : ''}`}
                  onClick={() => setInputMode('virtual')}
                >
                  Virtual
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {inputMode === 'manual' ? (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="manual-input"
                >
                  <div className="dice-selector">
                    {[1, 2, 3, 4, 5, 6].map((value) => (
                      <motion.button
                        key={value}
                        className={`dice-btn ${manualValue === value.toString() ? 'selected' : ''}`}
                        onClick={() => setManualValue(value.toString())}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {value}
                      </motion.button>
                    ))}
                  </div>

                  <div className="manual-controls">
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={manualValue}
                      onChange={(e) => setManualValue(e.target.value)}
                      placeholder="1-6"
                      className="manual-input-field"
                    />
                    <motion.button
                      className="btn-primary add-roll-btn"
                      onClick={addManualRoll}
                      disabled={!manualValue || parseInt(manualValue) < 1 || parseInt(manualValue) > 6}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={20} />
                      Add Roll
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="virtual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="virtual-roller"
                >
                  <div className="dice-display">
                    <motion.div
                      className="virtual-dice"
                      animate={isRolling ? {
                        rotateX: [0, 360, 720, 1080],
                        rotateY: [0, 180, 360, 540],
                        rotateZ: [0, 90, 180, 270],
                      } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: isRolling ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    >
                      <Dice6 size={80} />
                    </motion.div>

                    {isRolling && (
                      <motion.div
                        className="rolling-text"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        Rolling...
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    className="btn-primary roll-btn"
                    onClick={rollVirtualDice}
                    disabled={isRolling}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isRolling ? (
                      <>
                        <Pause size={20} />
                        Rolling...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={20} />
                        Roll Dice
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Middle Section - Frequency Chart */}
          <motion.div
            className="chart-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="section-header">
              <h2>Frequency Analysis</h2>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis
                    dataKey="value"
                    stroke="var(--text-secondary)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="var(--text-secondary)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-glass)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#gradientPrimary)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-purple)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary-purple)" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="frequency-stats">
              <div className="stat-item">
                <span className="stat-label">Total Rolls:</span>
                <span className="stat-value">40</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average:</span>
                <span className="stat-value">3.5</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Most Common:</span>
                <span className="stat-value">3</span>
              </div>
            </div>
          </motion.div>

          {/* Right Section - History Log */}
          <motion.div
            className="history-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="section-header">
              <h2>Roll History</h2>
              <div className="history-toggle">
                <button
                  className={`toggle-btn ${!showHistory ? 'active' : ''}`}
                  onClick={() => setShowHistory(false)}
                >
                  Current
                </button>
                <button
                  className={`toggle-btn ${showHistory ? 'active' : ''}`}
                  onClick={() => setShowHistory(true)}
                >
                  All
                </button>
              </div>
            </div>

            <div className="history-container">
              <AnimatePresence>
                {(showHistory ? sampleRolls : (currentSession?.rolls || [])).map((roll, index) => (
                  <motion.div
                    key={roll.id}
                    className={`history-item ${roll.type === 'virtual' ? 'virtual' : 'manual'}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="roll-value">{roll.value}</div>
                    <div className="roll-info">
                      <span className="roll-type">{roll.type}</span>
                      <span className="roll-time">
                        {roll.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!showHistory && (!currentSession?.rolls || currentSession.rolls.length === 0)) && (
                <div className="empty-history">
                  <Dice6 size={48} />
                  <p>No rolls yet</p>
                  <span>Start rolling to see your history</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;