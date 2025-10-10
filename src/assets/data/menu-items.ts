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
        url: '/challenges',
      },
      {
        key: 'web-diet-plan',
        label: 'Diet Plan',
        url: '/diet-plan',
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
      {
        key: 'social-interactions',
        label: 'Interactions',
        url: '/interactions',
      },
      {
        key: 'social-stories',
        label: 'Stories',
        url: '/social/stories',
      },
    ],
  },
  {
    key: 'recipes',
    label: 'Recipes',
    icon: 'solar:chef-hat-broken',
    children: [
      {
        key: 'recipes-view',
        label: 'View',
        url: '/recipes/view',
      },
      {
        key: 'recipes-create',
        label: 'Create',
        url: '/recipes/create',
      },
    ],
  },
  {
    key: 'overall-performance',
    label: 'Overall Performance',
    icon: 'solar:chart-2-broken',
    url: '/overall-performance',
  },
]
