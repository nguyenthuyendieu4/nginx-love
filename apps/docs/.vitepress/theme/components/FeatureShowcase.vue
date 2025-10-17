<template>
  <div class="feature-showcase">
    <div class="container">
      <div class="showcase-item" v-for="(feature, index) in features" :key="index">
        <div class="showcase-content" :class="{ reverse: index % 2 === 1 }">
          <div class="content-text" data-animate="fade-up">
            <div class="feature-tag">
              <span>{{ feature.tag }}</span>
            </div>
            <h2 class="feature-title">{{ feature.title }}</h2>
            <p class="feature-description">{{ feature.description }}</p>
            <ul class="feature-list">
              <li v-for="(item, i) in feature.items" :key="i">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.1"/>
                  <path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ item }}</span>
              </li>
            </ul>
            <a :href="feature.link" class="feature-link">
              <span>Learn more</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
          
          <div class="content-visual" data-animate="fade-up" :data-delay="200">
            <div class="visual-wrapper">
              <component :is="feature.visual" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

// Inline styles for grid items to bypass scoped CSS issues
const gridItemStyle = {
  display: 'flex',
  flexDirection: 'row' as const,
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '16px',
  padding: '20px 24px',
  minHeight: 'auto',
  textAlign: 'left' as const,
  background: 'hsl(var(--vp-c-bg))',
  border: '1px solid hsl(var(--vp-c-divider))',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
  position: 'relative' as const,
  overflow: 'hidden' as const,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
}

const iconStyle = {
  flexShrink: 0,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
}

const textWrapperStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
  flex: '1'
}

// Hover handlers
const createHoverHandlers = (iconRef?: any) => ({
  onMouseenter: (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.transform = 'translateY(-6px) scale(1.02)'
    target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.18), 0 0 0 1px hsl(var(--vp-c-brand-1) / 0.3)'
    target.style.borderColor = 'hsl(var(--vp-c-brand-1) / 0.6)'
    
    // Animate icon
    const icon = target.querySelector('.item-icon') as HTMLElement
    if (icon) {
      icon.style.transform = 'scale(1.2) rotate(-5deg)'
      icon.style.filter = 'drop-shadow(0 4px 12px hsl(var(--vp-c-brand-1) / 0.4))'
    }
    
    // Animate label
    const label = target.querySelector('.item-label') as HTMLElement
    if (label) {
      label.style.transform = 'translateY(-2px)'
      label.style.color = 'hsl(var(--vp-c-brand-1))'
    }
    
    // Animate status/value
    const status = target.querySelector('.item-status, .item-value') as HTMLElement
    if (status) {
      status.style.transform = 'translateY(-2px) scale(1.05)'
      status.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  },
  onMouseleave: (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.transform = ''
    target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
    target.style.borderColor = 'hsl(var(--vp-c-divider))'
    
    // Reset icon
    const icon = target.querySelector('.item-icon') as HTMLElement
    if (icon) {
      icon.style.transform = ''
      icon.style.filter = ''
    }
    
    // Reset label
    const label = target.querySelector('.item-label') as HTMLElement
    if (label) {
      label.style.transform = ''
      label.style.color = ''
    }
    
    // Reset status/value
    const status = target.querySelector('.item-status, .item-value') as HTMLElement
    if (status) {
      status.style.transform = ''
      status.style.boxShadow = ''
    }
  }
})

const features = [
  {
    tag: '🌐 Core Feature',
    title: 'Advanced Domain Management',
    description: 'Manage multiple domains with ease. Configure reverse proxies, load balancing, and SSL certificates all from one intuitive dashboard.',
    items: [
      'Multi-domain support with unlimited sites',
      'Automatic SSL certificate provisioning',
      'Load balancing and failover configuration',
      'Custom headers and redirects'
    ],
    link: '/guide/domains',
    visual: () => h('div', { class: 'visual-domain' }, [
      h('div', { 
        class: 'visual-grid',
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%'
        }
      }, [
        // Row 1
        h('div', { 
          class: 'grid-item primary',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('path', { d: 'M12 2L2 7L12 12L22 7L12 2Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
            h('path', { d: 'M2 17L12 22L22 17', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
            h('path', { d: 'M2 12L12 17L22 12', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'example.com'),
            h('div', { class: 'item-status success' }, '● Online')
          ])
        ]),
        h('div', { 
          class: 'grid-item',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', stroke: 'currentColor', 'stroke-width': '2' }),
            h('path', { d: 'M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11', stroke: 'currentColor', 'stroke-width': '2' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'SSL/TLS'),
            h('div', { class: 'item-status success' }, '● Valid')
          ])
        ]),
        // Row 2
        h('div', { 
          class: 'grid-item',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('circle', { cx: '12', cy: '12', r: '10', stroke: 'currentColor', 'stroke-width': '2' }),
            h('path', { d: 'M12 6V12L16 14', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'Uptime'),
            h('div', { class: 'item-status' }, '99.9%')
          ])
        ]),
        h('div', { 
          class: 'grid-item accent',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('path', { d: 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z', stroke: 'currentColor', 'stroke-width': '2' }),
            h('path', { d: 'M2 12H22', stroke: 'currentColor', 'stroke-width': '2' }),
            h('path', { d: 'M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z', stroke: 'currentColor', 'stroke-width': '2' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'Load Balancer'),
            h('div', { class: 'item-status success' }, '● Active')
          ])
        ])
      ])
    ])
  },
  {
    tag: '�️ Security',
    title: 'ModSecurity WAF Protection',
    description: 'Enterprise-grade Web Application Firewall with OWASP Core Rule Set. Protect your applications from common vulnerabilities and attacks.',
    items: [
      'OWASP CRS 4.0 with auto-updates',
      'Custom rule management',
      'Real-time threat detection',
      'Detailed security logs and alerts'
    ],
    link: '/guide/modsecurity',
    visual: () => h('div', { class: 'visual-security' }, [
      h('div', { 
        class: 'visual-grid security-grid',
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%'
        }
      }, [
        // Threat blocks
        h('div', { 
          class: 'grid-item threat blocked',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('path', { d: 'M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
            h('path', { d: 'M9 12L11 14L15 10', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'SQL Injection'),
            h('div', { class: 'item-status danger' }, '⛔ Blocked')
          ])
        ]),
        h('div', { 
          class: 'grid-item threat blocked',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('path', { d: 'M4 7H20M10 11H14M8 15H16M6 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'XSS Attack'),
            h('div', { class: 'item-status danger' }, '⛔ Blocked')
          ])
        ]),
        h('div', { 
          class: 'grid-item threat monitored',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('path', { d: 'M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z', stroke: 'currentColor', 'stroke-width': '2' }),
            h('circle', { cx: '12', cy: '12', r: '3', stroke: 'currentColor', 'stroke-width': '2' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'Suspicious IP'),
            h('div', { class: 'item-status warning' }, '⚠️ Monitored')
          ])
        ]),
        h('div', { 
          class: 'grid-item primary',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', stroke: 'currentColor', 'stroke-width': '2' }),
            h('path', { d: 'M3 9H21', stroke: 'currentColor', 'stroke-width': '2' }),
            h('path', { d: 'M9 21V9', stroke: 'currentColor', 'stroke-width': '2' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'Rules Active'),
            h('div', { class: 'item-status success' }, '● 1,247')
          ])
        ])
      ])
    ])
  },
  {
    tag: '📊 Analytics',
    title: 'Real-time Performance Monitoring',
    description: 'Monitor your infrastructure health with comprehensive metrics, dashboards, and alerts. Make data-driven decisions with detailed analytics.',
    items: [
      'Real-time performance metrics',
      'Traffic analysis and visualization',
      'Resource usage monitoring',
      'Customizable alerts and notifications'
    ],
    link: '/guide/performance',
    visual: () => h('div', { class: 'visual-analytics' }, [
      h('div', { 
        class: 'visual-grid analytics-grid',
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%'
        }
      }, [
        // Metrics cards
        h('div', { 
          class: 'grid-item metric-card',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('path', { d: 'M13 2L3 14H12L11 22L21 10H12L13 2Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'Requests/sec'),
            h('div', { class: 'item-value primary' }, '1,247')
          ])
        ]),
        h('div', { 
          class: 'grid-item metric-card',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('polyline', { points: '22 12 18 12 15 21 9 3 6 12 2 12', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'Avg Latency'),
            h('div', { class: 'item-value success' }, '45ms')
          ])
        ]),
        h('div', { 
          class: 'grid-item metric-card',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('path', { d: 'M3 3V16C3 17.1046 3.89543 18 5 18H21', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }),
            h('path', { d: 'M7 14L12 9L16 13L21 8', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'CPU Usage'),
            h('div', { class: 'item-value' }, '42%')
          ])
        ]),
        h('div', { 
          class: 'grid-item metric-card accent',
          style: gridItemStyle,
          ...createHoverHandlers()
        }, [
          h('svg', { 
            width: '48', 
            height: '48', 
            viewBox: '0 0 24 24', 
            fill: 'none', 
            class: 'item-icon',
            style: iconStyle
          }, [
            h('circle', { cx: '12', cy: '12', r: '10', stroke: 'currentColor', 'stroke-width': '2' }),
            h('path', { d: 'M16 12L12 8V16L16 12Z', fill: 'currentColor' })
          ]),
          h('div', { style: textWrapperStyle }, [
            h('div', { class: 'item-label' }, 'Bandwidth'),
            h('div', { class: 'item-value' }, '2.4 GB/s')
          ])
        ])
      ])
    ])
  }
]
</script>

<style scoped>
.feature-showcase {
  padding: 80px 0;
  background: hsl(var(--vp-c-bg));
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.showcase-item {
  margin-bottom: 120px;
}

.showcase-item:last-child {
  margin-bottom: 0;
}

.showcase-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.showcase-content.reverse {
  direction: rtl;
}

.showcase-content.reverse > * {
  direction: ltr;
}

.content-text {
  max-width: 540px;
}

.feature-tag {
  display: inline-flex;
  padding: 6px 16px;
  background: hsl(var(--vp-c-bg-soft));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 20px 0;
  background: linear-gradient(120deg, 
    hsl(var(--vp-c-text-1)) 0%,
    hsl(var(--vp-c-text-2)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-description {
  font-size: 18px;
  line-height: 1.6;
  color: hsl(var(--vp-c-text-2));
  margin: 0 0 28px 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 16px;
  color: hsl(var(--vp-c-text-1));
}

.feature-list li svg {
  flex-shrink: 0;
  color: hsl(var(--vp-c-brand-1));
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: hsl(var(--vp-c-brand-1));
  font-weight: 600;
  text-decoration: none;
  transition: gap 0.3s ease;
}

.feature-link:hover {
  gap: 12px;
}

.content-visual {
  position: relative;
}

.visual-wrapper {
  position: relative;
  padding: 32px;
  background: linear-gradient(135deg, 
    hsl(var(--vp-c-bg-soft)) 0%, 
    hsl(var(--vp-c-bg)) 100%
  );
  border: 1px solid hsl(var(--vp-c-divider));
  border-radius: 24px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.visual-wrapper::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle, 
    hsl(var(--vp-c-brand-1) / 0.08) 0%, 
    transparent 60%
  );
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { 
    transform: rotate(0deg); 
  }
  to { 
    transform: rotate(360deg); 
  }
}

/* Grid Layout */
.visual-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  grid-template-rows: auto auto !important;
  gap: 16px;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 100%;
}

.security-grid,
.analytics-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  grid-template-rows: auto auto !important;
}

.grid-item {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  min-height: 160px;
  width: 100%;
  box-sizing: border-box;
  background: hsl(var(--vp-c-bg)) !important;
  border: 1px solid hsl(var(--vp-c-divider)) !important;
  border-radius: 16px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  cursor: pointer !important;
  position: relative !important;
  overflow: hidden !important;
}

.grid-item::before {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  background: linear-gradient(135deg, 
    hsl(var(--vp-c-brand-1) / 0.05) 0%, 
    transparent 50%
  ) !important;
  opacity: 0 !important;
  transition: opacity 0.4s ease !important;
}

.visual-grid .grid-item:hover::before {
  opacity: 1 !important;
}

.visual-grid .grid-item:hover {
  transform: translateY(-6px) scale(1.02) !important;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.18),
    0 0 0 1px hsl(var(--vp-c-brand-1) / 0.3) !important;
  border-color: hsl(var(--vp-c-brand-1) / 0.6) !important;
}

.grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: hsl(var(--vp-c-brand-1) / 0.5);
}

.grid-item.primary {
  background: linear-gradient(135deg, 
    hsl(var(--vp-c-brand-1) / 0.12) 0%, 
    hsl(var(--vp-c-brand-2) / 0.06) 100%
  );
  border-color: hsl(var(--vp-c-brand-1) / 0.4);
  box-shadow: 0 4px 12px hsl(var(--vp-c-brand-1) / 0.15);
}

.grid-item.accent {
  background: linear-gradient(135deg, 
    hsl(var(--vp-c-brand-2) / 0.12) 0%, 
    hsl(var(--vp-c-brand-3) / 0.06) 100%
  );
  border-color: hsl(var(--vp-c-brand-2) / 0.4);
  box-shadow: 0 4px 12px hsl(var(--vp-c-brand-2) / 0.15);
}

.grid-item.threat {
  position: relative;
  overflow: hidden;
}

.grid-item.threat::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(239, 68, 68, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.grid-item.threat:hover::after {
  opacity: 1;
}

.item-icon {
  width: 48px !important;
  height: 48px !important;
  color: hsl(var(--vp-c-brand-1)) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  flex-shrink: 0 !important;
  margin: 0 auto !important;
  position: relative !important;
  z-index: 1 !important;
}

.visual-grid .grid-item:hover .item-icon {
  transform: scale(1.2) rotate(-5deg) !important;
  filter: drop-shadow(0 4px 12px hsl(var(--vp-c-brand-1) / 0.4)) !important;
}

.visual-grid .grid-item.primary .item-icon {
  color: hsl(var(--vp-c-brand-1)) !important;
}

.visual-grid .grid-item.primary:hover .item-icon {
  filter: drop-shadow(0 4px 16px hsl(var(--vp-c-brand-1) / 0.6)) !important;
  animation: pulse-glow 1.5s ease-in-out infinite !important;
}

.visual-grid .grid-item.accent .item-icon {
  color: hsl(var(--vp-c-brand-2)) !important;
}

.visual-grid .grid-item.accent:hover .item-icon {
  filter: drop-shadow(0 4px 16px hsl(var(--vp-c-brand-2) / 0.6)) !important;
  animation: pulse-glow 1.5s ease-in-out infinite !important;
}

.visual-grid .grid-item.blocked .item-icon {
  color: #ef4444 !important;
}

.visual-grid .grid-item.blocked:hover .item-icon {
  filter: drop-shadow(0 4px 16px rgba(239, 68, 68, 0.6)) !important;
  animation: shake 0.6s ease-in-out !important;
}

.visual-grid .grid-item.monitored .item-icon {
  color: #f59e0b !important;
}

.visual-grid .grid-item.monitored:hover .item-icon {
  filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.6)) !important;
  animation: pulse-glow 1.5s ease-in-out infinite !important;
}

.item-label {
  font-size: 15px !important;
  font-weight: 600 !important;
  color: hsl(var(--vp-c-text-1)) !important;
  line-height: 1.4 !important;
  margin: 8px 0 0 0 !important;
  text-align: center !important;
  width: 100% !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.3s ease !important;
}

.visual-grid .grid-item:hover .item-label {
  transform: translateY(-2px) !important;
  color: hsl(var(--vp-c-brand-1)) !important;
}

.item-status {
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 6px 16px !important;
  border-radius: 999px !important;
  background: hsl(var(--vp-c-bg-soft)) !important;
  color: hsl(var(--vp-c-text-2)) !important;
  white-space: nowrap !important;
  text-align: center !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.3s ease !important;
}

.visual-grid .grid-item:hover .item-status {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.item-status.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.item-status.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.item-status.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.item-value {
  font-size: 24px !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg,
    hsl(var(--vp-c-text-1)) 0%,
    hsl(var(--vp-c-text-2)) 100%
  ) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.3s ease !important;
}

.visual-grid .grid-item:hover .item-value {
  transform: translateY(-2px) scale(1.05) !important;
}

.item-value.primary {
  background: linear-gradient(135deg,
    hsl(var(--vp-c-brand-1)) 0%,
    hsl(var(--vp-c-brand-2)) 100%
  ) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.item-value.success {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

/* Metric Card Style */
.grid-item.metric-card {
  padding: 28px 20px;
}

.grid-item.metric-card .item-label {
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--vp-c-text-2));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Visual Wrapper Containers */
.visual-domain,
.visual-security,
.visual-analytics {
  width: 100%;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 4px 12px currentColor);
    opacity: 1;
  }
  50% {
    filter: drop-shadow(0 6px 20px currentColor);
    opacity: 0.8;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-4px) rotate(-5deg);
  }
  75% {
    transform: translateX(4px) rotate(5deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .showcase-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .visual-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .showcase-content.reverse {
    direction: ltr;
  }
  
  .feature-title {
    font-size: 32px;
  }
  
  .showcase-item {
    margin-bottom: 80px;
  }
}

@media (max-width: 640px) {
  .feature-title {
    font-size: 28px;
  }
  
  .feature-description {
    font-size: 16px;
  }
  
  .visual-grid {
    grid-template-columns: 1fr !important;
    gap: 12px;
  }
  
  .grid-item {
    padding: 20px 12px;
    min-height: 120px;
  }
  
  .item-value {
    font-size: 20px;
  }
  
  .visual-wrapper {
    padding: 20px;
  }
  
  .item-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
