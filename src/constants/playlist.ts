import type { PlaylistMapping } from '@/type'

export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'

export const CHANNEL_MAPPING = [
  {
    group: '港台',
    channels: [
      {
        name: '翡翠台',
        logo: 'https://s2.loli.net/2024/12/22/gWrIwCqpHTAtuXZ.png',
      },
    ],
  },
  {
    group: '央视',
    channels: [
      {
        name: 'CCTV-1',
        logo: 'https://live.fanmingming.com/tv/CCTV1.png',
      },
      {
        name: 'CCTV-2',
        logo: 'https://live.fanmingming.com/tv/CCTV2.png',
      },
      {
        name: 'CCTV-3',
        logo: 'https://live.fanmingming.com/tv/CCTV3.png',
      },
      {
        name: 'CCTV-4',
        logo: 'https://live.fanmingming.com/tv/CCTV4.png',
      },
      {
        name: 'CCTV-5',
        logo: 'https://live.fanmingming.com/tv/CCTV5.png',
      },
      {
        name: 'CCTV-6',
        logo: 'https://live.fanmingming.com/tv/CCTV6.png',
      },
      {
        name: 'CCTV-7',
        logo: 'https://live.fanmingming.com/tv/CCTV7.png',
      },
      {
        name: 'CCTV-8',
        logo: 'https://live.fanmingming.com/tv/CCTV8.png',
      },
      {
        name: 'CCTV-9',
        logo: 'https://live.fanmingming.com/tv/CCTV9.png',
      },
      {
        name: 'CCTV-10',
        logo: 'https://live.fanmingming.com/tv/CCTV10.png',
      },
      {
        name: 'CCTV-11',
        logo: 'https://live.fanmingming.com/tv/CCTV11.png',
      },
      {
        name: 'CCTV-12',
        logo: 'https://live.fanmingming.com/tv/CCTV12.png',
      },
      {
        name: 'CCTV-13',
        logo: 'https://live.fanmingming.com/tv/CCTV13.png',
      },
      {
        name: 'CCTV-14',
        logo: 'https://live.fanmingming.com/tv/CCTV14.png',
      },
      {
        name: 'CCTV-15',
        logo: 'https://live.fanmingming.com/tv/CCTV15.png',
      },
      {
        name: 'CCTV-16',
        logo: 'https://live.fanmingming.com/tv/CCTV16.png',
      },
      {
        name: 'CCTV-17',
        logo: 'https://live.fanmingming.com/tv/CCTV17.png',
      },
    ],
  },
  {
    group: '地方卫视',
    channels: [
      {
        name: '大湾区卫视',
        logo: 'https://live.fanmingming.com/tv/大湾区卫视.png',
      },
      {
        name: '湖南卫视',
        logo: 'https://live.fanmingming.com/tv/湖南卫视.png',
      },
      {
        name: '东方卫视',
        logo: 'https://live.fanmingming.com/tv/东方卫视.png',
      },
      {
        name: '四川卫视',
        logo: 'https://live.fanmingming.com/tv/四川卫视.png',
      },
      {
        name: '天津卫视',
        logo: 'https://live.fanmingming.com/tv/天津卫视.png',
      },
      {
        name: '安徽卫视',
        logo: 'https://live.fanmingming.com/tv/安徽卫视.png',
      },
      {
        name: '山东卫视',
        logo: 'https://live.fanmingming.com/tv/山东卫视.png',
      },
      {
        name: '深圳卫视',
        logo: 'https://live.fanmingming.com/tv/深圳卫视.png',
      },
      {
        name: '广东卫视',
        logo: 'https://live.fanmingming.com/tv/广东卫视.png',
      },
      {
        name: '广西卫视',
        logo: 'https://live.fanmingming.com/tv/广西卫视.png',
      },
      {
        name: '江苏卫视',
        logo: 'https://live.fanmingming.com/tv/江苏卫视.png',
      },
      {
        name: '江西卫视',
        logo: 'https://live.fanmingming.com/tv/江西卫视.png',
      },
      {
        name: '河北卫视',
        logo: 'https://live.fanmingming.com/tv/河北卫视.png',
      },
      {
        name: '河南卫视',
        logo: 'https://live.fanmingming.com/tv/河南卫视.png',
      },
      {
        name: '浙江卫视',
        logo: 'https://live.fanmingming.com/tv/浙江卫视.png',
      },
      {
        name: '海南卫视',
        logo: 'https://live.fanmingming.com/tv/海南卫视.png',
      },
      {
        name: '湖北卫视',
        logo: 'https://live.fanmingming.com/tv/湖北卫视.png',
      },
      {
        name: '山西卫视',
        logo: 'https://live.fanmingming.com/tv/山西卫视.png',
      },
      {
        name: '东南卫视',
        logo: 'https://live.fanmingming.com/tv/东南卫视.png',
      },
      {
        name: '贵州卫视',
        logo: 'https://live.fanmingming.com/tv/贵州卫视.png',
      },
      {
        name: '辽宁卫视',
        logo: 'https://live.fanmingming.com/tv/辽宁卫视.png',
      },
      {
        name: '重庆卫视',
        logo: 'https://live.fanmingming.com/tv/重庆卫视.png',
      },
      {
        name: '黑龙江卫视',
        logo: 'https://live.fanmingming.com/tv/黑龙江卫视.png',
      },
      {
        name: '内蒙古卫视',
        logo: 'https://live.fanmingming.com/tv/内蒙古卫视.png',
      },
      {
        name: '宁夏卫视',
        logo: 'https://live.fanmingming.com/tv/宁夏卫视.png',
      },
      {
        name: '陕西卫视',
        logo: 'https://live.fanmingming.com/tv/陕西卫视.png',
      },
      {
        name: '吉林卫视',
        logo: 'https://live.fanmingming.com/tv/吉林卫视.png',
      },
      {
        name: '甘肃卫视',
        logo: 'https://live.fanmingming.com/tv/甘肃卫视.png',
      },
      {
        name: '云南卫视',
        logo: 'https://live.fanmingming.com/tv/云南卫视.png',
      },
      {
        name: '三沙卫视',
        logo: 'https://live.fanmingming.com/tv/三沙卫视.png',
      },
      {
        name: '青海卫视',
        logo: 'https://live.fanmingming.com/tv/青海卫视.png',
      },
      {
        name: '新疆卫视',
        logo: 'https://live.fanmingming.com/tv/新疆卫视.png',
      },
      {
        name: '西藏卫视',
        logo: 'https://live.fanmingming.com/tv/西藏卫视.png',
      },
      {
        name: '农林卫视',
        logo: 'https://live.fanmingming.com/tv/农林卫视.png',
      },
      {
        name: '厦门卫视',
        logo: 'https://live.fanmingming.com/tv/厦门卫视.png',
      },
    ],
  },
] satisfies PlaylistMapping
