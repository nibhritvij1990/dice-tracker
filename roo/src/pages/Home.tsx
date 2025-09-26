import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BarChart3, Settings, Dice6, TrendingUp, History } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tracker', label: 'Tracker', icon: Dice6 },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const features = [
    {
      title: 'Smart Dice Tracking',
      description: 'Track every roll with precision',
      icon: Dice6,
      gradient: 'var(--gradient-primary)',
    },
    {
      title: 'Real-time Analytics',
      description: 'Visual insights into your gaming patterns',
      icon: TrendingUp,
      gradient: 'var(--gradient-secondary)',
    },
    {
      title: 'Session History',
      description: 'Complete history of all your gaming sessions',
      icon: History,
      gradient: 'var(--gradient-accent)',
    },
  ];

  return (
    <div className="home-container">
      {/* Background Elements */}
      <div className="home-background">
        <div className="floating-shapes">
          <motion.div
            className="shape shape-1"
            animate={{
              y: [-30, 30, -30],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="shape shape-2"
            animate={{
              y: [30, -30, 30],
              rotate: [360, 180, 0],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Header */}
      <motion.header
        className="home-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-content">
          <motion.h1
            className="header-title"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            className="header-subtitle"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Ready to track your next gaming session?
          </motion.p>
        </div>
        <motion.button
          className="btn-primary start-session-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tracker')}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
        >
          <Play size={20} />
          Start Session
        </motion.button>
      </motion.header>

      {/* Liquid Glass Tab Navigation */}
      <motion.div
        className="tab-navigation"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="tab-container">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                className={`liquid-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="tab-indicator"
                    layoutId="tabIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="tab-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="overview-content"
            >
              <div className="features-grid">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      className="feature-card glass-hover"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
                      whileHover={{
                        y: -10,
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <div
                        className="feature-icon"
                        style={{ background: feature.gradient }}
                      >
                        <Icon size={32} />
                      </div>
                      <h3 className="feature-title">{feature.title}</h3>
                      <p className="feature-description">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                className="quick-stats"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                <h2 className="stats-title">Quick Stats</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">247</div>
                    <div className="stat-label">Total Rolls</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">12</div>
                    <div className="stat-label">Sessions</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">4.2</div>
                    <div className="stat-label">Avg per Session</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="tracker-preview"
            >
              <div className="preview-placeholder">
                <Dice6 size={64} />
                <h3>Dice Tracker</h3>
                <p>Advanced dice tracking with manual input and virtual rolling</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="history-preview"
            >
              <div className="preview-placeholder">
                <History size={64} />
                <h3>Session History</h3>
                <p>Complete history of all your gaming sessions</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="analytics-preview"
            >
              <div className="preview-placeholder">
                <TrendingUp size={64} />
                <h3>Analytics Dashboard</h3>
                <p>Visual insights into your gaming patterns</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Home;