import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.domains': 'Domains',
      'nav.modsecurity': 'ModSecurity',
      'nav.ssl': 'SSL Certificates',
      'nav.logs': 'Logs',
      'nav.alerts': 'Alerts',
      'nav.acl': 'Access Control',
      'nav.access-lists': 'Access Lists',
      'nav.performance': 'Performance',
      'nav.backup': 'Backup & Restore',
      'nav.users': 'User Management',
      'nav.nodes': 'Slave Nodes',
      'nav.network': 'Network Manager',
      'nav.plugins': 'Plugins',
      'nav.marketplace': 'Marketplace',
      'nav.groups.main': 'Main',
      'nav.groups.domain management': 'Domain Management',
      'nav.groups.security': 'Security',
      'nav.groups.monitoring': 'Monitoring',
      'nav.groups.system': 'System',
      'nav.groups.plugins': 'Plugins',
      'nav.groups.thirdparty': 'Third Party Plugins',
      
      // Login
      'login.title': 'Admin Portal',
      'login.username': 'Username',
      'login.password': 'Password',
      'login.2fa': '2FA Code',
      'login.signin': 'Sign In',
      
      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.overview': 'System Overview',
      'dashboard.domains': 'Total Domains',
      'dashboard.traffic': 'Traffic',
      'dashboard.errors': 'Errors',
      'dashboard.uptime': 'Uptime',
      
      // Domains
      'domains.title': 'Domain Management',
      'domains.add': 'Add Domain',
      'domains.search': 'Search domains...',
      'domains.name': 'Domain Name',
      'domains.status': 'Status',
      'domains.ssl': 'SSL',
      'domains.modsec': 'ModSecurity',
      'domains.actions': 'Actions',
      
      // ModSecurity
      'modsec.title': 'ModSecurity Configuration',
      'modsec.global': 'Global Settings',
      'modsec.rules': 'CRS Rules',
      'modsec.custom': 'Custom Rules',
      
      // Common
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.enabled': 'Enabled',
      'common.disabled': 'Disabled',
      'common.active': 'Active',
      'common.inactive': 'Inactive',
    }
  },
  vi: {
    translation: {
      // Navigation
      'nav.dashboard': 'Bảng điều khiển',
      'nav.domains': 'Tên miền',
      'nav.modsecurity': 'ModSecurity',
      'nav.ssl': 'Chứng chỉ SSL',
      'nav.logs': 'Nhật ký',
      'nav.alerts': 'Cảnh báo',
      'nav.acl': 'Kiểm soát truy cập',
      'nav.access-lists': 'Danh sách truy cập',
      'nav.performance': 'Hiệu suất',
      'nav.backup': 'Sao lưu & Khôi phục',
      'nav.users': 'Quản lý người dùng',
      'nav.nodes': 'Nút phụ',
      'nav.network': 'Quản lý mạng',
      'nav.plugins': 'Tiện ích mở rộng',
      'nav.marketplace': 'Chợ ứng dụng',
      'nav.groups.main': 'Chính',
      'nav.groups.domain management': 'Quản lý tên miền',
      'nav.groups.security': 'Bảo mật',
      'nav.groups.monitoring': 'Giám sát',
      'nav.groups.system': 'Hệ thống',
      'nav.groups.plugins': 'Tiện ích',
      'nav.groups.thirdparty': 'Tiện ích bên thứ ba',
      
      // Login
      'login.title': 'Cổng Quản Trị',
      'login.username': 'Tên đăng nhập',
      'login.password': 'Mật khẩu',
      'login.2fa': 'Mã 2FA',
      'login.signin': 'Đăng nhập',
      
      // Dashboard
      'dashboard.title': 'Bảng điều khiển',
      'dashboard.overview': 'Tổng quan hệ thống',
      'dashboard.domains': 'Tổng số tên miền',
      'dashboard.traffic': 'Lưu lượng',
      'dashboard.errors': 'Lỗi',
      'dashboard.uptime': 'Thời gian hoạt động',
      
      // Domains
      'domains.title': 'Quản lý tên miền',
      'domains.add': 'Thêm tên miền',
      'domains.search': 'Tìm kiếm tên miền...',
      'domains.name': 'Tên miền',
      'domains.status': 'Trạng thái',
      'domains.ssl': 'SSL',
      'domains.modsec': 'ModSecurity',
      'domains.actions': 'Hành động',
      
      // ModSecurity
      'modsec.title': 'Cấu hình ModSecurity',
      'modsec.global': 'Cài đặt toàn cục',
      'modsec.rules': 'Quy tắc CRS',
      'modsec.custom': 'Quy tắc tùy chỉnh',
      
      // Common
      'common.save': 'Lưu',
      'common.cancel': 'Hủy',
      'common.delete': 'Xóa',
      'common.edit': 'Sửa',
      'common.enabled': 'Đã bật',
      'common.disabled': 'Đã tắt',
      'common.active': 'Hoạt động',
      'common.inactive': 'Không hoạt động',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
