'use client';

import TopBar from '@/components/layout/TopBar';
import { MoreVertical, Mail, Phone, Edit, Trash } from 'lucide-react';

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
  return (
    <>
      <TopBar title="Contacts" />

      <div className="p-8 bg-light-bg dark:bg-slate-900">
        <div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
          style={{
            animation: 'scaleIn 0.5s ease-out both'
          }}
        >
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-extrabold text-dark">Authors Table</h2>
            <p className="text-sm text-text-secondary mt-1">Manage your contacts and conversations</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light-bg dark:bg-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Last Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Lifecycle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
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
