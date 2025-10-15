import { MenuItemType } from '@/types/menu'

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    label: 'DAAWAT',
    isTitle: true,
  },
  {
    key: 'dashboards',
    label: 'Dashboard',
    icon: 'solar:widget-2-broken',
    url: '/dashboards',
  },
  {
    key: 'web',
    label: 'Web',
    icon: 'solar:global-broken',
    children: [
      {
        key: 'web-challenges',
        label: 'Challenges',
        url: '/challengers',
      },
    ],
  },
  {
    key: 'social',
    label: 'Social',
    icon: 'solar:share-broken',
    children: [
      {
        key: 'social-analytics',
        label: 'Analytics',
        url: '/social/analytics',
      },
      {
        key: 'social-hashtag-performance',
        label: 'Hashtag Performance',
        url: '/social/hashtag-performance',
      },
      // {
      //   key: 'social-interactions',
      //   label: 'Interactions',
      //   url: '/interactions',
      // },
      {
        key: 'social-stories',
        label: 'Stories',
        url: '/social/stories',
      },
    ],
  },
  {
    key: 'diet-plan',
    label: 'Diet Plan',
    icon: 'solar:chef-hat-broken',
    url: '/diet-plan',
  },
  {
    key: 'challengers',
    label: 'Challengers',
    icon: 'solar:cardholder-outline',
    url: '/challengers',
  },

  // {
  //   key: 'overall-performance',
  //   label: 'Overall Performance',
  //   icon: 'solar:chart-2-broken',
  //   url: '/overall-performance',
  // },
]
