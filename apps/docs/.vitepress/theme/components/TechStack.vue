<template>
  <div class="tech-stack">
    <div class="container">
      <div class="section-header" data-animate="fade-up">
        <div class="section-tag">💻 Technology</div>
        <h2 class="section-title">Built with Modern Stack</h2>
        <p class="section-description">
          Powered by industry-leading technologies for performance, security, and scalability
        </p>
      </div>
      
      <div class="tech-grid">
        <div 
          v-for="(tech, index) in technologies" 
          :key="index"
          class="tech-card"
          data-animate="fade-up"
          :data-delay="index * 50"
        >
          <div class="tech-icon" v-html="tech.icon"></div>
          <h3 class="tech-name">{{ tech.name }}</h3>
          <p class="tech-description">{{ tech.description }}</p>
        </div>
      </div>
      
      <div class="architecture-section" data-animate="fade-up">
        <h3 class="architecture-title">Architecture Overview</h3>
        <div class="architecture-container">
          <div class="arch-flow">
            <div 
              v-for="(layer, index) in architectureLayers" 
              :key="index"
              class="arch-flow-item"
            >
              <div 
                class="arch-box"
                :style="{ borderColor: layer.color, '--box-color': layer.color }"
              >
                <div class="arch-box-header">
                  <span class="arch-icon">{{ layer.icon }}</span>
                  <h4 class="arch-label">{{ layer.label }}</h4>
                </div>
                <div class="arch-components-list">
                  <div 
                    v-for="(comp, idx) in layer.components" 
                    :key="idx"
                    class="arch-comp-item"
                  >
                    <div class="comp-dot" :style="{ background: layer.color }"></div>
                    <div class="comp-info">
                      <div class="comp-name">{{ comp.name }}</div>
                      <div class="comp-desc">{{ comp.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="index < architectureLayers.length - 1" class="arch-arrow">
                <svg viewBox="0 0 60 40" fill="none">
                  <path d="M0 20 L50 20 M50 20 L42 12 M50 20 L42 28" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Architecture layers data
const architectureLayers = [
  {
    label: 'Client Layer',
    icon: '🌐',
    color: '#3b82f6',
    components: [
      { name: 'Web Browser', desc: 'Modern browsers with PWA support' },
      { name: 'Client App', desc: 'Cross-Platform Support' }
    ]
  },
  {
    label: 'Frontend',
    icon: '⚛️',
    color: '#8b5cf6',
    components: [
      { name: 'React + TypeScript', desc: 'Component-based UI framework' },
      { name: 'TanStack Router', desc: 'Type-safe routing' },
      { name: 'ShadCN UI + Tailwind', desc: 'Modern design system' }
    ]
  },
  {
    label: 'Backend API',
    icon: '⚡',
    color: '#10b981',
    components: [
      { name: 'Node.js + Express', desc: 'RESTful API server' },
      { name: 'Prisma ORM', desc: 'Type-safe database client' },
      { name: 'JWT Auth', desc: 'Secure authentication' }
    ]
  },
  {
    label: 'Security Layer',
    icon: '🛡️',
    color: '#ef4444',
    components: [
      { name: 'ModSecurity WAF', desc: 'Web application firewall' },
      { name: 'Nginx Reverse Proxy', desc: 'Load balancing & SSL' },
      { name: 'OWASP CRS', desc: 'Core rule set protection' }
    ]
  },
  {
    label: 'Data Layer',
    icon: '🗄️',
    color: '#f59e0b',
    components: [
      { name: 'PostgreSQL', desc: 'Primary database' },
      { name: 'File Storage', desc: 'SSL certs & configs' }
    ]
  }
]

const technologies = [
  {
    name: 'Nginx',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#009639"/><path d="M14 14h6l8 12V14h6v20h-6l-8-12v12h-6V14z" fill="white"/></svg>',
    description: 'High-performance web server and reverse proxy'
  },
  {
    name: 'ModSecurity',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#0066CC"/><path d="M24 12l-8 4v8c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11v-8l-8-4z" fill="white"/></svg>',
    description: 'Enterprise-grade Web Application Firewall'
  },
  {
    name: 'React',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#61DAFB"/><circle cx="24" cy="24" r="3" fill="#20232A"/><ellipse cx="24" cy="24" rx="12" ry="5" stroke="#20232A" stroke-width="2" fill="none"/><ellipse cx="24" cy="24" rx="12" ry="5" stroke="#20232A" stroke-width="2" fill="none" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="12" ry="5" stroke="#20232A" stroke-width="2" fill="none" transform="rotate(-60 24 24)"/></svg>',
    description: 'Modern UI library with TypeScript'
  },
  {
    name: 'Node.js',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#339933"/><path d="M24 12l-10 6v12l10 6 10-6V18l-10-6zm0 4l6 3.5v7L24 30l-6-3.5v-7L24 16z" fill="white"/></svg>',
    description: 'Scalable backend runtime environment'
  },
  {
    name: 'PostgreSQL',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#336791"/><path d="M18 16c0-4 2-6 6-6s6 2 6 6v12c0 2-1 4-3 4-1 0-2-1-2-2v-8h-2v8c0 1-1 2-2 2-2 0-3-2-3-4V16z" fill="white"/></svg>',
    description: 'Robust relational database system'
  },
  {
    name: 'Docker',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#2496ED"/><rect x="14" y="22" width="4" height="4" fill="white"/><rect x="19" y="22" width="4" height="4" fill="white"/><rect x="24" y="22" width="4" height="4" fill="white"/><rect x="19" y="17" width="4" height="4" fill="white"/><rect x="24" y="17" width="4" height="4" fill="white"/><rect x="29" y="22" width="4" height="4" fill="white"/></svg>',
    description: 'Containerization and deployment'
  },
  {
    name: 'Prisma',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#2D3748"/><path d="M24 12l-8 20 16-8-8-12z" fill="white"/></svg>',
    description: 'Next-generation ORM for database'
  },
  {
    name: 'TypeScript',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#3178C6"/><path d="M14 24h6v10h4V24h6v-4H14v4zm20-4v4h-4v10h4v4h-8V20h8z" fill="white"/></svg>',
    description: 'Type-safe JavaScript development'
  }
]
</script>

<style scoped>
.tech-stack {
  padding: 100px 0;
  background: linear-gradient(to bottom,
    hsl(var(--vp-c-bg)) 0%,
    hsl(var(--vp-c-bg-soft)) 50%,
    hsl(var(--vp-c-bg)) 100%
  );
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 60px;
}

.section-tag {
  display: inline-flex;
  padding: 8px 20px;
  background: hsl(var(--vp-c-bg-soft));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.section-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 16px 0;
  background: linear-gradient(120deg,
    hsl(var(--vp-c-text-1)) 0%,
    hsl(var(--vp-c-text-2)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-description {
  font-size: 20px;
  line-height: 1.6;
  color: hsl(var(--vp-c-text-2));
  margin: 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

.tech-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px;
  background: hsl(var(--vp-c-bg));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 16px;
  transition: all 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: hsl(var(--vp-c-brand-1));
}

.tech-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
}

.tech-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.tech-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: hsl(var(--vp-c-text-1));
}

.tech-description {
  font-size: 14px;
  line-height: 1.5;
  color: hsl(var(--vp-c-text-2));
  margin: 0;
}

.architecture-section {
  margin-top: 80px;
}

.architecture-title {
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin: 0 0 48px 0;
  background: linear-gradient(120deg,
    hsl(var(--vp-c-text-1)) 0%,
    hsl(var(--vp-c-brand-1)) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
}

.architecture-container {
  padding: 40px 20px;
  background: linear-gradient(135deg, hsl(var(--vp-c-bg-soft)) 0%, hsl(var(--vp-c-bg)) 100%);
  border-radius: 24px;
  border: 1px solid hsl(var(--vp-c-divider));
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  width: 100%;
}

.arch-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 20px;
  min-width: max-content;
}

.arch-flow-item {
  display: flex;
  align-items: center;
  gap: 0;
}

.arch-box {
  width: 240px;
  padding: 20px;
  background: hsl(var(--vp-c-bg));
  border: 2px solid;
  border-radius: 12px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
}

.arch-box::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 16px;
  padding: 3px;
  background: linear-gradient(135deg, var(--box-color), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.arch-box:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 
    0 20px 48px rgba(0, 0, 0, 0.2),
    0 0 0 2px var(--box-color),
    0 0 40px var(--box-color);
}

.arch-box:hover::before {
  opacity: 0.6;
}

.arch-box-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid;
  border-color: inherit;
  opacity: 0.3;
}

.arch-icon {
  font-size: 28px;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.arch-label {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: hsl(var(--vp-c-text-1));
  letter-spacing: 0.5px;
}

.arch-components-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.arch-comp-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: hsl(var(--vp-c-bg-soft));
  border: 1px solid hsl(var(--vp-c-divider));
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.arch-comp-item:hover {
  transform: translateX(6px);
  background: hsl(var(--vp-c-bg));
  border-color: var(--box-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comp-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  box-shadow: 0 0 6px currentColor;
}

.comp-info {
  flex: 1;
  min-width: 0;
}

.comp-name {
  font-weight: 600;
  font-size: 13px;
  color: hsl(var(--vp-c-text-1));
  margin-bottom: 3px;
  line-height: 1.3;
}

.comp-desc {
  font-size: 11px;
  color: hsl(var(--vp-c-text-2));
  line-height: 1.4;
}

.arch-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  color: hsl(var(--vp-c-text-2));
  opacity: 0.5;
  transition: all 0.3s ease;
}

.arch-arrow svg {
  width: 50px;
  height: 35px;
  transition: all 0.3s ease;
}

.arch-flow-item:hover .arch-arrow {
  opacity: 1;
  color: hsl(var(--vp-c-brand-1));
}

.arch-flow-item:hover .arch-arrow svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 36px;
  }
  
  .architecture-title {
    font-size: 28px;
  }
  
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .architecture-container {
    padding: 20px;
  }
  
  .arch-flow {
    flex-direction: column;
    gap: 16px;
  }
  
  .arch-arrow {
    transform: rotate(90deg);
    padding: 12px 0;
  }
}
</style>
