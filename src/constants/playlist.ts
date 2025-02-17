import type { Channels } from '@/type'

export const CHANNEL_LIST = [
  { id: 1, name: '翡翠台', logo: 'https://s2.loli.net/2024/12/22/gWrIwCqpHTAtuXZ.png' },
  { id: 2, name: 'CCTV-1', logo: 'https://live.fanmingming.com/tv/CCTV1.png' },
  { id: 3, name: 'CCTV-2', logo: 'https://live.fanmingming.com/tv/CCTV2.png' },
  { id: 4, name: 'CCTV-3', logo: 'https://live.fanmingming.com/tv/CCTV3.png' },
  { id: 5, name: 'CCTV-4', logo: 'https://live.fanmingming.com/tv/CCTV4.png' },
  { id: 6, name: 'CCTV-5', logo: 'https://live.fanmingming.com/tv/CCTV5.png' },
  { id: 7, name: 'CCTV-6', logo: 'https://live.fanmingming.com/tv/CCTV6.png' },
  { id: 8, name: 'CCTV-7', logo: 'https://live.fanmingming.com/tv/CCTV7.png' },
  { id: 9, name: 'CCTV-8', logo: 'https://live.fanmingming.com/tv/CCTV8.png' },
  { id: 10, name: 'CCTV-9', logo: 'https://live.fanmingming.com/tv/CCTV9.png' },
  { id: 11, name: 'CCTV-10', logo: 'https://live.fanmingming.com/tv/CCTV10.png' },
  { id: 12, name: 'CCTV-11', logo: 'https://live.fanmingming.com/tv/CCTV11.png' },
  { id: 13, name: 'CCTV-12', logo: 'https://live.fanmingming.com/tv/CCTV12.png' },
  { id: 14, name: 'CCTV-13', logo: 'https://live.fanmingming.com/tv/CCTV13.png' },
  { id: 15, name: 'CCTV-14', logo: 'https://live.fanmingming.com/tv/CCTV14.png' },
  { id: 16, name: 'CCTV-15', logo: 'https://live.fanmingming.com/tv/CCTV15.png' },
  { id: 17, name: 'CCTV-16', logo: 'https://live.fanmingming.com/tv/CCTV16.png' },
  { id: 18, name: 'CCTV-17', logo: 'https://live.fanmingming.com/tv/CCTV17.png' },
  { id: 19, name: '大湾区卫视', logo: 'https://live.fanmingming.com/tv/大湾区卫视.png' },
  { id: 20, name: '湖南卫视', logo: 'https://live.fanmingming.com/tv/湖南卫视.png' },
  { id: 21, name: '东方卫视', logo: 'https://live.fanmingming.com/tv/东方卫视.png' },
  { id: 22, name: '四川卫视', logo: 'https://live.fanmingming.com/tv/四川卫视.png' },
  { id: 23, name: '天津卫视', logo: 'https://live.fanmingming.com/tv/天津卫视.png' },
  { id: 24, name: '安徽卫视', logo: 'https://live.fanmingming.com/tv/安徽卫视.png' },
  { id: 25, name: '山东卫视', logo: 'https://live.fanmingming.com/tv/山东卫视.png' },
  { id: 26, name: '深圳卫视', logo: 'https://live.fanmingming.com/tv/深圳卫视.png' },
  { id: 27, name: '广东卫视', logo: 'https://live.fanmingming.com/tv/广东卫视.png' },
  { id: 28, name: '广西卫视', logo: 'https://live.fanmingming.com/tv/广西卫视.png' },
  { id: 29, name: '江苏卫视', logo: 'https://live.fanmingming.com/tv/江苏卫视.png' },
  { id: 30, name: '江西卫视', logo: 'https://live.fanmingming.com/tv/江西卫视.png' },
  { id: 31, name: '河北卫视', logo: 'https://live.fanmingming.com/tv/河北卫视.png' },
  { id: 32, name: '河南卫视', logo: 'https://live.fanmingming.com/tv/河南卫视.png' },
  { id: 33, name: '浙江卫视', logo: 'https://live.fanmingming.com/tv/浙江卫视.png' },
  { id: 34, name: '海南卫视', logo: 'https://live.fanmingming.com/tv/海南卫视.png' },
  { id: 35, name: '湖北卫视', logo: 'https://live.fanmingming.com/tv/湖北卫视.png' },
  { id: 36, name: '山西卫视', logo: 'https://live.fanmingming.com/tv/山西卫视.png' },
  { id: 37, name: '东南卫视', logo: 'https://live.fanmingming.com/tv/东南卫视.png' },
  { id: 38, name: '贵州卫视', logo: 'https://live.fanmingming.com/tv/贵州卫视.png' },
  { id: 39, name: '辽宁卫视', logo: 'https://live.fanmingming.com/tv/辽宁卫视.png' },
  { id: 40, name: '重庆卫视', logo: 'https://live.fanmingming.com/tv/重庆卫视.png' },
  { id: 41, name: '黑龙江卫视', logo: 'https://live.fanmingming.com/tv/黑龙江卫视.png' },
  { id: 42, name: '内蒙古卫视', logo: 'https://live.fanmingming.com/tv/内蒙古卫视.png' },
  { id: 43, name: '宁夏卫视', logo: 'https://live.fanmingming.com/tv/宁夏卫视.png' },
  { id: 44, name: '陕西卫视', logo: 'https://live.fanmingming.com/tv/陕西卫视.png' },
  { id: 45, name: '吉林卫视', logo: 'https://live.fanmingming.com/tv/吉林卫视.png' },
  { id: 46, name: '甘肃卫视', logo: 'https://live.fanmingming.com/tv/甘肃卫视.png' },
  { id: 47, name: '云南卫视', logo: 'https://live.fanmingming.com/tv/云南卫视.png' },
  { id: 48, name: '三沙卫视', logo: 'https://live.fanmingming.com/tv/三沙卫视.png' },
  { id: 49, name: '青海卫视', logo: 'https://live.fanmingming.com/tv/青海卫视.png' },
  { id: 50, name: '新疆卫视', logo: 'https://live.fanmingming.com/tv/新疆卫视.png' },
  { id: 51, name: '西藏卫视', logo: 'https://live.fanmingming.com/tv/西藏卫视.png' },
  { id: 52, name: '农林卫视', logo: 'https://live.fanmingming.com/tv/农林卫视.png' },
  { id: 53, name: '厦门卫视', logo: 'https://live.fanmingming.com/tv/厦门卫视.png' },
  { id: 54, name: '黃金翡翠台', logo: 'https://s2.loli.net/2025/01/15/Glqak9ruYIKmRPd.png' },
  { id: 55, name: '明珠台', logo: 'https://s2.loli.net/2024/12/22/3RFSj2eCrnQlkOa.png' },
] satisfies Channels[]

export const CHANNEL_GROUP: Record<string, string[]> = {
  香港电视: ['翡翠台', '黃金翡翠台', '明珠台'],
  广东频道: ['大湾区卫视', '广东卫视', '广东珠江', '广东体育'],
  中央电视: [
    'CCTV-1',
    'CCTV-2',
    'CCTV-3',
    'CCTV-4',
    'CCTV-5',
    'CCTV-6',
    'CCTV-7',
    'CCTV-8',
    'CCTV-9',
    'CCTV-10',
    'CCTV-11',
    'CCTV-12',
    'CCTV-13',
    'CCTV-14',
    'CCTV-15',
    'CCTV-16',
    'CCTV-17',
  ],
  地方卫视: [
    '大湾区卫视',
    '湖南卫视',
    '东方卫视',
    '四川卫视',
    '天津卫视',
    '安徽卫视',
    '山东卫视',
    '深圳卫视',
    '广东卫视',
    '广西卫视',
    '江苏卫视',
    '江西卫视',
    '河北卫视',
    '河南卫视',
    '浙江卫视',
    '海南卫视',
    '湖北卫视',
    '山西卫视',
    '东南卫视',
    '贵州卫视',
    '辽宁卫视',
    '重庆卫视',
    '黑龙江卫视',
    '内蒙古卫视',
    '宁夏卫视',
    '陕西卫视',
    '吉林卫视',
    '甘肃卫视',
    '云南卫视',
    '三沙卫视',
    '青海卫视',
    '新疆卫视',
    '西藏卫视',
    '农林卫视',
    '厦门卫视',
  ],
}
