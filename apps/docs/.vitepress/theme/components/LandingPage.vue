<template>
  <div class="landing-page">
    <HomeHero />

    <div class="features-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">✨ Features</div>
          <h2 class="section-title">Everything you need for enterprise security</h2>
          <p class="section-description">
            A comprehensive platform with all the tools and features you need to manage,
            monitor, and secure your web infrastructure.
          </p>
        </div>
        <FeatureGrid />
      </div>
    </div>

    <FeatureShowcase />

    <Statistics />

    <TechStack />

    <QuickStart />

    <div class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">💬 Testimonials</div>
          <h2 class="section-title">Trusted by teams worldwide</h2>
          <p class="section-description">
            See what our users have to say about nginx-love
          </p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-content">
              "nginx-love has transformed how we manage our infrastructure. The ModSecurity integration
              is seamless and the monitoring capabilities are top-notch."
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">👤</div>
              <div class="author-info">
                <div class="author-name">John Smith</div>
                <div class="author-role">DevOps Engineer</div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              "The best WAF management platform we've used. Easy to set up, powerful features,
              and excellent documentation. Highly recommended!"
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">👤</div>
              <div class="author-info">
                <div class="author-name">Sarah Johnson</div>
                <div class="author-role">Security Architect</div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              "We migrated from a legacy system to nginx-love and couldn't be happier.
              The performance improvements are remarkable."
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">👤</div>
              <div class="author-info">
                <div class="author-name">Michael Chen</div>
                <div class="author-role">CTO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="final-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to get started?</h2>
          <p class="cta-description">
            Join thousands of teams using nginx-love to secure and manage their infrastructure
          </p>
          <div class="cta-actions">
            <a href="/guide/installation" class="cta-btn primary">
              <span>Get Started Now</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a href="https://github.com/TinyActive/nginx-love" class="cta-btn secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeHero from './HomeHero.vue'
import FeatureGrid from './FeatureGrid.vue'
import FeatureShowcase from './FeatureShowcase.vue'
import Statistics from './Statistics.vue'
import TechStack from './TechStack.vue'
import QuickStart from './QuickStart.vue'
</script>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
}

.features-section {
  padding: 100px 0;
  background: hsl(var(--vp-c-bg-soft));
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
  background: hsl(var(--vp-c-bg));
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

.testimonials-section {
  padding: 100px 0;
  background: hsl(var(--vp-c-bg));
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.testimonial-card {
  padding: 32px;
  background: hsl(var(--vp-c-bg-soft));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 16px;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: hsl(var(--vp-c-brand-1));
}

.testimonial-content {
  font-size: 16px;
  line-height: 1.6;
  color: hsl(var(--vp-c-text-1));
  margin-bottom: 24px;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--vp-c-bg));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 50%;
  font-size: 24px;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: hsl(var(--vp-c-text-1));
}

.author-role {
  font-size: 14px;
  color: hsl(var(--vp-c-text-2));
}

.final-cta {
  padding: 100px 0;
  background: linear-gradient(135deg,
    hsl(var(--vp-c-brand-soft)) 0%,
    hsl(var(--vp-c-bg-soft)) 100%
  );
  border-top: 1px solid hsl(var(--vp-c-border));
}

.cta-content {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.cta-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 20px 0;
  background: linear-gradient(120deg,
    hsl(var(--vp-c-text-1)) 0%,
    hsl(var(--vp-c-brand-1)) 50%,
    hsl(var(--vp-c-brand-2)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-description {
  font-size: 20px;
  line-height: 1.6;
  color: hsl(var(--vp-c-text-2));
  margin: 0 0 32px 0;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
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
  
  .cta-title {
    font-size: 40px;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
  }
  
  .cta-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
