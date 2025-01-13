'use client'

import * as React from 'react'
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Library,
  Map,
  PartyPopperIcon,
  PieChart,
  Receipt,
  Settings2,
  User2Icon
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavUser } from './nav-user'

import LogoSmall from '../shared/LogoSmall'

// This is sample data.
const data = {
  user: {
    name: 'library',
    email: 'admin@library.com',
    avatar: '/avatar.png'
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  navMain: [
    {
      title: 'Catalogue',
      url: '#',
      icon: Library,
      isActive: false,
      items: [
        {
          title: 'Admin - home',
          url: '/admin'
        },
        {
          title: 'Starred',
          url: '#'
        },
        {
          title: 'Settings',
          url: '#'
        }
      ]
    },
    {
      title: 'Activities',
      url: '#',
      icon: PartyPopperIcon,
      items: [
        {
          title: 'Activities schedule',
          url: '/admin/activities'
        },
        {
          title: 'Explorer',
          url: '#'
        },
        {
          title: 'Quantum',
          url: '#'
        }
      ]
    },
    {
      title: 'Fines',
      url: '#',
      icon: Receipt,
      items: [
        {
          title: 'Fines schedule',
          url: '/admin/fines'
        },
        {
          title: 'Get Started',
          url: '#'
        },
        {
          title: 'Tutorials',
          url: '#'
        },
        {
          title: 'Changelog',
          url: '#'
        }
      ]
    },
    {
      title: 'Categories',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Categories schedule',
          url: '/admin/categories'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    },
    {
      title: 'Users',
      url: '#',
      icon: User2Icon,
      items: [
        {
          title: 'User schedule',
          url: '/admin/users'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ]
}

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <LogoSmall />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
