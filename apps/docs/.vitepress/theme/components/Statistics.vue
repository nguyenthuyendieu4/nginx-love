<template>
  <div class="statistics">
    <div class="container">
      <div class="stats-grid">
        <div 
          v-for="(stat, index) in stats" 
          :key="index"
          class="stat-card"
          data-animate="fade-up"
          :data-delay="index * 100"
        >
          <div class="stat-icon" v-html="stat.icon"></div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  {
    icon: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none"/><path d="M24 8v16l12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    value: '99.9%',
    label: 'Uptime Guarantee'
  },
  {
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 24h16M16 28h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    value: '10K+',
    label: 'Active Installations'
  },
  {
    icon: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 12l-8 4v8c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11v-8l-8-4z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    value: '1M+',
    label: 'Threats Blocked Daily'
  },
  {
    icon: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="12" stroke="currentColor" stroke-width="2" fill="none"/><path d="M24 16v8l6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    value: '<45ms',
    label: 'Average Response Time'
  }
]
</script>

<style scoped>
.statistics {
  padding: 80px 0;
  background: linear-gradient(135deg,
    hsl(var(--vp-c-brand-soft)) 0%,
    hsl(var(--vp-c-bg-soft)) 100%
  );
  border-top: 1px solid hsl(var(--vp-c-border));
  border-bottom: 1px solid hsl(var(--vp-c-border));
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px;
  background: hsl(var(--vp-c-bg));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: hsl(var(--vp-c-brand-1));
}

.stat-icon {
  width: 48px;
  height: 48px;
  color: hsl(var(--vp-c-brand-1));
  flex-shrink: 0;
}

.stat-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(120deg,
    hsl(var(--vp-c-brand-1)) 0%,
    hsl(var(--vp-c-brand-2)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--vp-c-text-2));
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 32px;
  }
}
</style>
