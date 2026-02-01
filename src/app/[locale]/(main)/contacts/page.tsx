'use client';

import TopBar from '@/components/layout/TopBar';
import { MoreVertical, Mail, Phone, Edit, Trash } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';

const contacts = [
  {
    id: 1,
    name: 'Alex Rivera',
    email: 'alex.rivera@techcorp.com',
    channel: 'WhatsApp',
    status: 'active',
    lastMessage: '2m ago',
    lifecycle: 'Customer',
    assignee: 'Rashed',
  },
  {
    id: 2,
    name: 'Maya Patel',
    email: 'maya.patel@innovate.io',
    channel: 'Telegram',
    status: 'active',
    lastMessage: '5m ago',
    lifecycle: 'Lead',
    assignee: 'Ahmed',
  },
  {
    id: 3,
    name: 'James Kim',
    email: 'j.kim@enterprise.co',
    channel: 'WhatsApp',
    status: 'inactive',
    lastMessage: '2h ago',
    lifecycle: 'Prospect',
    assignee: 'Rashed',
  },
  {
    id: 4,
    name: 'Sofia Andersson',
    email: 'sofia@nordicsolutions.se',
    channel: 'Facebook',
    status: 'active',
    lastMessage: '10m ago',
    lifecycle: 'Qualified Lead',
    assignee: 'Sarah',
  },
  {
    id: 5,
    name: 'Omar Hassan',
    email: 'omar.h@globalventures.ae',
    channel: 'Instagram',
    status: 'active',
    lastMessage: '1h ago',
    lifecycle: 'Customer',
    assignee: 'Ahmed',
  },
  {
    id: 6,
    name: 'Elena Rodriguez',
    email: 'elena@startuplab.mx',
    channel: 'WhatsApp',
    status: 'active',
    lastMessage: '25m ago',
    lifecycle: 'Lead',
    assignee: 'Rashed',
  },
];

export default function ContactsPage() {
  const t = useTranslations('Contacts');
  usePageTitle(t('title'));
  return (
    <>
      <TopBar title={t('title')} />

      <div className="p-4 tablet:p-8 bg-light-bg dark:bg-slate-900 min-h-screen overflow-y-auto">
        <div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
          style={{
            animation: 'scaleIn 0.5s ease-out both'
          }}
        >
          {/* Mobile Card View */}
          <div className="tablet:hidden divide-y divide-gray-200 dark:divide-slate-700">
            {contacts.map((contact, index) => (
              <div
                key={contact.id}
                className="p-4 hover:bg-light-bg dark:hover:bg-slate-700 transition-colors"
                style={{
                  animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {contact.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-dark dark:text-white truncate">{contact.name}</p>
                      <p className="text-xs text-text-secondary dark:text-slate-300 truncate">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-light-bg dark:hover:bg-slate-600 rounded-lg transition-colors">
                      <Edit size={16} className="text-text-secondary dark:text-slate-300" />
                    </button>
                    <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-red/10 rounded-lg transition-colors">
                      <Trash size={16} className="text-red" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-lg">
                    {contact.channel}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      contact.status === 'active'
                        ? 'bg-green/20 text-green'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {contact.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                    contact.lifecycle === 'Customer' ? 'bg-green/20 text-green' :
                    contact.lifecycle === 'Lead' ? 'bg-blue/20 text-blue' :
                    contact.lifecycle === 'Qualified Lead' ? 'bg-primary/20 text-primary' :
                    contact.lifecycle === 'Prospect' ? 'bg-amber/20 text-amber' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {contact.lifecycle}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-text-secondary dark:text-slate-400">
                  <span>{contact.lastMessage}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-[10px] font-bold">
                      {contact.assignee[0]}
                    </div>
                    <span>{contact.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden tablet:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light-bg dark:bg-slate-700">
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Last Message
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Lifecycle
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-light-bg transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                    style={{
                      animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                          {contact.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-dark">{contact.name}</p>
                          <p className="text-xs text-text-secondary dark:text-slate-300">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-lg">
                        {contact.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                          contact.status === 'active'
                            ? 'bg-green/20 text-green'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-slate-300">
                      {contact.lastMessage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                        contact.lifecycle === 'Customer' ? 'bg-green/20 text-green border border-green/30' :
                        contact.lifecycle === 'Lead' ? 'bg-blue/20 text-blue border border-blue/30' :
                        contact.lifecycle === 'Qualified Lead' ? 'bg-primary/20 text-primary border border-primary/30' :
                        contact.lifecycle === 'Prospect' ? 'bg-amber/20 text-amber border border-amber/30' :
                        'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}>
                        {contact.lifecycle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-xs font-bold">
                          {contact.assignee[0]}
                        </div>
                        <span className="text-sm text-dark font-medium">{contact.assignee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                          <Edit size={16} className="text-text-secondary dark:text-slate-300" />
                        </button>
                        <button className="p-2 hover:bg-red/10 rounded-lg transition-colors">
                          <Trash size={16} className="text-red" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
