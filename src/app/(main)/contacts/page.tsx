'use client';

import TopBar from '@/components/layout/TopBar';
import { MoreVertical, Mail, Phone, Edit, Trash } from 'lucide-react';

const contacts = [
  {
    id: 1,
    name: 'Sarah Johnson',
    channel: 'WhatsApp',
    status: 'active',
    lastMessage: '2m ago',
    tags: ['VIP', 'Support'],
    assignee: 'Rashed',
  },
  {
    id: 2,
    name: 'Mike Chen',
    channel: 'Telegram',
    status: 'active',
    lastMessage: '5m ago',
    tags: ['Sales'],
    assignee: 'Ahmed',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    channel: 'WhatsApp',
    status: 'inactive',
    lastMessage: '2h ago',
    tags: ['Support', 'Priority'],
    assignee: 'Rashed',
  },
  {
    id: 4,
    name: 'John Doe',
    channel: 'Facebook',
    status: 'active',
    lastMessage: '10m ago',
    tags: ['Billing'],
    assignee: 'Sarah',
  },
];

export default function ContactsPage() {
  return (
    <>
      <TopBar title="Contacts" />

      <div className="p-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-extrabold text-dark">Authors Table</h2>
            <p className="text-sm text-text-secondary mt-1">Manage your contacts and conversations</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light-bg">
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
                    Tags
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
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-light-bg transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                          {contact.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-dark">{contact.name}</p>
                          <p className="text-xs text-text-secondary">contact@email.com</p>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {contact.lastMessage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {contact.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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
                          <Edit size={16} className="text-text-secondary" />
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
