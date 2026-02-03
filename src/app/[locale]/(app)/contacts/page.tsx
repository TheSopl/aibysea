'use client';

import TopBar from '@/components/layout/TopBar';
import { MoreVertical, Mail, Phone, Edit, Trash } from 'lucide-react';
import { FaWhatsapp, FaTelegram, FaFacebook, FaInstagram } from 'react-icons/fa';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

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

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'WhatsApp':
      return <FaWhatsapp size={16} className="text-green-600" />;
    case 'Telegram':
      return <FaTelegram size={16} className="text-blue-500" />;
    case 'Facebook':
      return <FaFacebook size={16} className="text-blue-600" />;
    case 'Instagram':
      return <FaInstagram size={16} className="text-pink-600" />;
    default:
      return null;
  }
};

export default function ContactsPage() {
  const t = useTranslations('Contacts');
  usePageTitle(t('title'));
  return (
    <>
      <TopBar title={t('title')} />

      <div className="p-4 tablet:p-6 bg-gray-100 dark:bg-slate-900 min-h-screen overflow-y-auto max-w-[1600px] mx-auto">
        <div
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-white/10 overflow-hidden"
          style={{
            animation: 'scaleIn 0.5s ease-out both'
          }}
        >
          <div className="tablet:hidden divide-y divide-gray-100 dark:divide-slate-700">
            {contacts.map((contact, index) => (
              <div
                key={contact.id}
                className="p-3 hover:bg-light-bg dark:hover:bg-slate-700 transition-colors"
                style={{
                  animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {contact.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-dark dark:text-white truncate">{contact.name}</p>
                      <p className="text-xs text-text-secondary dark:text-slate-300 truncate">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Button variant="ghost" size="sm" iconOnly icon={<Edit size={14} className="text-text-secondary dark:text-slate-300" />} className="min-w-[44px] min-h-[44px]" />
                    <Button variant="danger" size="sm" iconOnly icon={<Trash size={14} />} className="min-w-[44px] min-h-[44px] bg-transparent hover:bg-red/10 text-red" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-light-bg dark:bg-slate-700 rounded-md">
                    {getChannelIcon(contact.channel)}
                    <span className="text-xs font-medium text-dark dark:text-white">{contact.channel}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md ${
                      contact.status === 'active'
                        ? 'bg-green/10 text-green'
                        : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${contact.status === 'active' ? 'bg-green' : 'bg-gray-400'}`}></div>
                    {contact.status}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                    contact.lifecycle === 'Customer' ? 'bg-green/10 text-green' :
                    contact.lifecycle === 'Lead' ? 'bg-blue/10 text-blue' :
                    contact.lifecycle === 'Qualified Lead' ? 'bg-primary/10 text-primary' :
                    contact.lifecycle === 'Prospect' ? 'bg-amber/10 text-amber' :
                    'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
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

          <div className="hidden tablet:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light-bg dark:bg-slate-700 border-b border-white/5">
                  <th className="px-4 py-2 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-4 py-2 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Last Message
                  </th>
                  <th className="px-4 py-2 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Lifecycle
                  </th>
                  <th className="px-4 py-2 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-4 py-2 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {contacts.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-light-bg dark:hover:bg-slate-700 transition-colors"
                    style={{
                      animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-xs font-bold">
                          {contact.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark dark:text-white">{contact.name}</p>
                          <p className="text-xs text-text-secondary dark:text-slate-300">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-light-bg dark:bg-slate-700 rounded-md w-fit">
                        {getChannelIcon(contact.channel)}
                        <span className="text-sm font-medium text-dark dark:text-white">{contact.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-sm font-medium rounded-md ${
                          contact.status === 'active'
                            ? 'bg-green/10 text-green'
                            : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${contact.status === 'active' ? 'bg-green' : 'bg-gray-400'}`}></div>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-text-secondary dark:text-slate-300">
                      {contact.lastMessage}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-sm font-medium rounded-md ${
                        contact.lifecycle === 'Customer' ? 'bg-green/10 text-green' :
                        contact.lifecycle === 'Lead' ? 'bg-blue/10 text-blue' :
                        contact.lifecycle === 'Qualified Lead' ? 'bg-primary/10 text-primary' :
                        contact.lifecycle === 'Prospect' ? 'bg-amber/10 text-amber' :
                        'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {contact.lifecycle}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-xs font-bold">
                          {contact.assignee[0]}
                        </div>
                        <span className="text-sm text-dark dark:text-white font-medium">{contact.assignee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" iconOnly icon={<Edit size={14} className="text-text-secondary dark:text-slate-300" />} />
                        <Button variant="danger" size="sm" iconOnly icon={<Trash size={14} />} className="bg-transparent hover:bg-red/10 text-red" />
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
