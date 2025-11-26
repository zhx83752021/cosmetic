/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    // 避免与 Element Plus 的样式冲突，添加前缀
    prefix: 'tw-',
    theme: {
        extend: {
            colors: {
                // 化妆品主题色系 - 优雅玫瑰金与柔和粉调
                primary: {
                    light: '#F4E4D7', // 柔和奶油色
                    DEFAULT: '#D4A59A', // 玫瑰金
                    dark: '#8B5E83', // 优雅深紫
                },
                accent: {
                    pink: '#F2A1B8', // 柔和粉色
                    coral: '#F5B5A8', // 珊瑚粉
                    gold: '#E8C4A0', // 香槟金
                    lavender: '#D4B5D4', // 薰衣草紫
                },
                neutral: {
                    cream: '#FAF7F5', // 奶油白
                    white: '#FFFFFF',
                    gray: '#F5F3F1', // 温暖灰
                    'gray-light': '#E8E6E4',
                },
                text: {
                    primary: '#4A3C3C', // 深棕色文字
                    secondary: '#8B7B7B', // 柔和灰色文字
                },
            },
            fontFamily: {
                sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
                display: ['Montserrat', 'Playfair Display', 'serif'],
            },
            borderRadius: {
                DEFAULT: '10px',
                card: '16px',
                'lg': '20px',
            },
            boxShadow: {
                card: '0 4px 16px rgba(212, 165, 154, 0.12)',
                'card-hover': '0 8px 24px rgba(212, 165, 154, 0.18)',
                soft: '0 2px 12px rgba(139, 94, 131, 0.08)',
                glow: '0 0 20px rgba(242, 161, 184, 0.2)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #F4E4D7 0%, #D4A59A 100%)',
                'gradient-accent': 'linear-gradient(135deg, #F2A1B8 0%, #D4B5D4 100%)',
                'gradient-warm': 'linear-gradient(135deg, #FAF7F5 0%, #F5F3F1 100%)',
            },
        },
    },
    plugins: [],
}
