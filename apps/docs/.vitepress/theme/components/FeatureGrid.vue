<template>
  <div class="feature-grid-container">
    <div class="feature-grid">
      <div 
        v-for="(feature, index) in features" 
        :key="index"
        class="feature-card"
      >
        <div class="feature-icon" v-html="feature.icon"></div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
        <a :href="feature.link" class="feature-link">
          Learn more →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: '🌐',
    title: 'Domain Management & Load Balancing',
    description: 'Manage multiple domains with advanced load balancing across upstream servers',
    link: '/guide/domains'
  },
  {
    icon: '🔒',
    title: 'SSL Certificate Management',
    description: 'Automate SSL certificate issuance, renewal, and management with Let\'s Encrypt integration',
    link: '/guide/ssl'
  },
  {
    icon: '🛡️',
    title: 'ModSecurity WAF',
    description: 'Protect your applications with advanced Web Application Firewall rules and OWASP CRS',
    link: '/guide/modsecurity'
  },
  {
    icon: '🔐',
    title: 'Access Control Lists (ACL)',
    description: 'IP whitelist/blacklist, GeoIP filtering, and User-Agent based access control',
    link: '/guide/acl'
  },
  {
    icon: '⚡',
    title: 'Network Load Balancer',
    description: 'High-performance load balancing with health checks and automatic failover',
    link: '/guide/loadbalancer'
  },
  {
    icon: '🔔',
    title: 'Smart Alert System',
    description: 'Real-time notifications via Email and Telegram for security events and system issues',
    link: '/guide/alerts'
  },
  {
    icon: '📊',
    title: 'Performance Monitoring',
    description: 'Monitor server performance, analyze traffic patterns, and optimize your setup',
    link: '/guide/performance'
  },
  {
    icon: '📝',
    title: 'Log Analysis',
    description: 'Analyze access and error logs to identify issues and optimize performance',
    link: '/guide/logs'
  },
  {
    icon: '👥',
    title: 'Multi-User Support',
    description: 'Manage multiple users with role-based access control and permissions',
    link: '/guide/users'
  }
]
</script>

<style scoped>
.feature-grid-container {
  width: 100%;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 0;
}

.feature-card {
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  background: hsl(var(--vp-c-bg));
  border: 1px solid hsl(var(--vp-c-border));
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: hsl(var(--vp-c-brand-1));
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
  line-height: 1;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: hsl(var(--vp-c-text-1));
}

.feature-description {
  font-size: 15px;
  line-height: 1.6;
  color: hsl(var(--vp-c-text-2));
  margin: 0 0 16px 0;
  flex: 1;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  color: hsl(var(--vp-c-brand-1));
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.feature-link:hover {
  color: hsl(var(--vp-c-brand-2));
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-card {
    padding: 24px 20px;
  }
}
</style>