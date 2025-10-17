<template>
  <div class="quick-start">
    <div class="container">
      <div class="section-header" data-animate="fade-up">
        <div class="section-tag">🚀 Get Started</div>
        <h2 class="section-title">Quick Start Guide</h2>
        <p class="section-description">
          Get your Nginx WAF platform up and running in minutes
        </p>
      </div>
      
      <div class="steps-container">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-card"
          data-animate="fade-up"
          :data-delay="index * 100"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <div class="code-block">
              <div class="code-header">
                <span class="code-lang">{{ step.lang }}</span>
                <button class="copy-btn" @click="copyCode(step.code, index)">
                  <svg v-if="!copied[index]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="4" y="4" width="8" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M6 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ copied[index] ? 'Copied!' : 'Copy' }}</span>
                </button>
              </div>
              <pre class="code-content"><code>{{ step.code }}</code></pre>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cta-section" data-animate="fade-up">
        <div class="cta-card">
          <div class="cta-content">
            <h3 class="cta-title">Need help getting started?</h3>
            <p class="cta-description">
              Check out our comprehensive documentation and guides
            </p>
          </div>
          <div class="cta-actions">
            <a href="/guide/installation" class="cta-btn primary">
              View Full Guide
            </a>
            <a href="/reference/troubleshooting" class="cta-btn secondary">
              Troubleshooting
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const copied = ref<Record<number, boolean>>({})

const steps = [
  {
    title: 'Clone the Repository',
    description: 'Get the latest version of nginx-love from GitHub',
    code: 'git clone https://github.com/nguyenthuyendieu4/nginx-love.git\ncd nginx-love',
    lang: 'bash'
  },
  {
    title: 'Production Deployment (New Server)',
    description: 'auto Install con VM all required packages using script tools',
    code: 'bash script/deploy.sh',
    lang: 'bash'
  },
  {
    title: 'Docker Configure Environment',
    description: 'Set up your environment variables',
    code: 'cp .env.example .env\n# Edit .env with your configuration',
    lang: 'bash'
  },
  {
    title: 'Start with Docker',
    description: 'Launch all services using Docker Compose',
    code: 'docker-compose build && docker-compose up -d',
    lang: 'bash'
  },
  {
    title: 'Access Dashboard',
    description: 'Open your browser and navigate to the dashboard',
    code: 'http://YOU_IP_PUBLIC:8080\n# Default: admin / admin123',
    lang: 'text'
  }
]

const copyCode = async (code: string, index: number) => {
  try {
    await navigator.clipboard.writeText(code)
    copied.value[index] = true
    setTimeout(() => {
      copied.value[index] = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.quick-start {
  padding: 100px 0;
  background: hsl(var(--vp-c-bg));
}

.container {
  max-width: 1280px;
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

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto 60px;
}

.step-card {
  display: flex;
  gap: 24px;
  padding: 32px;
  background: hsl(var(--vp-c-bg-soft));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 16px;
  transition: all 0.3s ease;
}

.step-card:hover {
  border-color: hsl(var(--vp-c-brand-1));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.step-number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    hsl(var(--vp-c-brand-1)) 0%,
    hsl(var(--vp-c-brand-2)) 100%
  );
  color: white;
  font-size: 20px;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: hsl(var(--vp-c-text-1));
}

.step-description {
  font-size: 16px;
  line-height: 1.5;
  color: hsl(var(--vp-c-text-2));
  margin: 0 0 16px 0;
}

.code-block {
  background: hsl(var(--vp-c-bg));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: hsl(var(--vp-c-bg-soft));
  border-bottom: 1px solid hsl(var(--vp-c-border));
}

.code-lang {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: hsl(var(--vp-c-text-2));
  letter-spacing: 0.05em;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: transparent;
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: hsl(var(--vp-c-text-2));
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: hsl(var(--vp-c-bg-soft));
  border-color: hsl(var(--vp-c-brand-1));
  color: hsl(var(--vp-c-brand-1));
}

.code-content {
  padding: 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: hsl(var(--vp-c-text-1));
  overflow-x: auto;
}

.code-content code {
  font-family: inherit;
}

.cta-section {
  max-width: 900px;
  margin: 0 auto;
}

.cta-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  padding: 40px;
  background: linear-gradient(135deg,
    hsl(var(--vp-c-brand-soft)) 0%,
    hsl(var(--vp-c-bg-soft)) 100%
  );
  border: 1px solid hsl(var(--vp-c-brand-1));
  border-radius: 16px;
}

.cta-content {
  flex: 1;
}

.cta-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: hsl(var(--vp-c-text-1));
}

.cta-description {
  font-size: 16px;
  line-height: 1.5;
  color: hsl(var(--vp-c-text-2));
  margin: 0;
}

.cta-actions {
  display: flex;
  gap: 12px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.cta-btn.primary {
  background: linear-gradient(135deg,
    hsl(var(--vp-c-brand-1)) 0%,
    hsl(var(--vp-c-brand-2)) 100%
  );
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.cta-btn.secondary {
  background: hsl(var(--vp-c-bg));
  color: hsl(var(--vp-c-text-1));
  border: 1px solid hsl(var(--vp-c-border));
}

.cta-btn.secondary:hover {
  background: hsl(var(--vp-c-bg-soft));
  border-color: hsl(var(--vp-c-brand-1));
}

@media (max-width: 768px) {
  .section-title {
    font-size: 36px;
  }
  
  .step-card {
    flex-direction: column;
    padding: 24px;
  }
  
  .step-number {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .step-title {
    font-size: 20px;
  }
  
  .cta-card {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }
  
  .cta-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .cta-btn {
    width: 100%;
  }
}
</style>
