import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './components.d.ts'
import './styles/variables.css'
import './styles/custom.css'
import './styles/main.css'
import './styles/vars.css'
import './styles/layout.css'

// Custom components
import CustomBadge from './components/Badge.vue'
import Callout from './components/Callout.vue'
import Card from './components/Card.vue'
import CardGrid from './components/CardGrid.vue'
import FeatureGrid from './components/FeatureGrid.vue'

// New landing page components
import HomeHero from './components/HomeHero.vue'
import FeatureShowcase from './components/FeatureShowcase.vue'
import TechStack from './components/TechStack.vue'
import QuickStart from './components/QuickStart.vue'
import Statistics from './components/Statistics.vue'
import LandingPage from './components/LandingPage.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // Register custom components globally
    app.component('CustomBadge', CustomBadge)
    app.component('Callout', Callout)
    app.component('Card', Card)
    app.component('CardGrid', CardGrid)
    app.component('FeatureGrid', FeatureGrid)
    
    // Register landing page components
    app.component('HomeHero', HomeHero)
    app.component('FeatureShowcase', FeatureShowcase)
    app.component('TechStack', TechStack)
    app.component('QuickStart', QuickStart)
    app.component('Statistics', Statistics)
    app.component('LandingPage', LandingPage)
  }
} satisfies Theme