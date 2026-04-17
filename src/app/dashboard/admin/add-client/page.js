// src/app/dashboard/admin/add-client/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Shadcn sonner library

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Yeh hamara Mega State hai jisme pura form data save hoga
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', website: '', address: '', companyType: 'Non BPO', description: '', status: 'Active',
    payoutDetails: { commercials: '', payoutDuration: '', replacementTime: '', paymentTerms: '' },
    contactPersons: [{ name: '', designation: '', phone: '', email: '' }],
    openings: [{ title: '', experience: '', salary: '', vacancies: '', expiryDate: '', description: '' }]
  });

  // Basic Form Fields Handle karne ka function
  const handleChange = (e, section, index, field) => {
    if (section === 'basic') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else if (section === 'payout') {
      setFormData({ ...formData, payoutDetails: { ...formData.payoutDetails, [e.target.name]: e.target.value } });
    } else if (section === 'contacts') {
      const updatedContacts = [...formData.contactPersons];
      updatedContacts[index][field] = e.target.value;
      setFormData({ ...formData, contactPersons: updatedContacts });
    } else if (section === 'openings') {
      const updatedOpenings = [...formData.openings];
      updatedOpenings[index][field] = e.target.value;
      setFormData({ ...formData, openings: updatedOpenings });
    }
  };

  // Naya Contact Person add/remove karne ka logic
  const addContactPerson = () => setFormData({ ...formData, contactPersons: [...formData.contactPersons, { name: '', designation: '', phone: '', email: '' }] });
  const removeContactPerson = (index) => setFormData({ ...formData, contactPersons: formData.contactPersons.filter((_, i) => i !== index) });

  // Nayi Opening add/remove karne ka logic
  const addOpening = () => setFormData({ ...formData, openings: [...formData.openings, { title: '', experience: '', salary: '', vacancies: '', expiryDate: '', description: '' }] });
  const removeOpening = (index) => setFormData({ ...formData, openings: formData.openings.filter((_, i) => i !== index) });

  // API ko data submit karne ka function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success("Client Added Successfully!");
        router.push('/dashboard/admin'); // Wapas dashboard pe le jao
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Network Error. Is Backend Running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">Add New Client</h1>
          <p className="text-gray-500 mt-1">Register a new company, their payouts, HRs, and initial openings.</p>
        </div>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-[#0796fe] font-medium text-sm transition-colors">
          Cancel & Go Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Company Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#092a49] mb-4 border-b pb-2">1. Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Company Name *</label><input required type="text" name="name" value={formData.name} onChange={(e) => handleChange(e, 'basic')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Tata Consultancy Services" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Company Type</label><select name="companyType" value={formData.companyType} onChange={(e) => handleChange(e, 'basic')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"><option>Non BPO</option><option>BPO</option><option>KPO</option><option>IT</option></select></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={(e) => handleChange(e, 'basic')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="careers@tcs.com" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={(e) => handleChange(e, 'basic')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 9999999999" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Website</label><input type="text" name="website" value={formData.website} onChange={(e) => handleChange(e, 'basic')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="www.tcs.com" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={(e) => handleChange(e, 'basic')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"><option>Active</option><option>Listed</option><option>Process</option><option>Non Active</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={(e) => handleChange(e, 'basic')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full Address" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={(e) => handleChange(e, 'basic')} rows="2" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief about the company..." /></div>
          </div>
        </div>

        {/* SECTION 2: Payout & Commercials */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#092a49] mb-4 border-b pb-2">2. Payout & Commercials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Commercials (%)</label><input type="text" name="commercials" value={formData.payoutDetails.commercials} onChange={(e) => handleChange(e, 'payout')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 8.33% of CTC" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Pay-out Duration</label><input type="text" name="payoutDuration" value={formData.payoutDetails.payoutDuration} onChange={(e) => handleChange(e, 'payout')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 30 Days" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Replacement Time</label><input type="text" name="replacementTime" value={formData.payoutDetails.replacementTime} onChange={(e) => handleChange(e, 'payout')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 60 Days" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Payment Terms</label><input type="text" name="paymentTerms" value={formData.payoutDetails.paymentTerms} onChange={(e) => handleChange(e, 'payout')} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Post joining & invoice submission" /></div>
          </div>
        </div>

        {/* SECTION 3: Contact Persons (DYNAMIC) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-[#092a49]">3. Contact Persons (HRs)</h2>
            <button type="button" onClick={addContactPerson} className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded-md font-bold hover:bg-orange-100">+ Add Person</button>
          </div>
          {formData.contactPersons.map((person, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start mb-4 bg-gray-50 p-4 rounded-lg relative">
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Name</label><input type="text" value={person.name} onChange={(e) => handleChange(e, 'contacts', index, 'name')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="HR Name" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Role</label><input type="text" value={person.designation} onChange={(e) => handleChange(e, 'contacts', index, 'designation')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="e.g. TA Head" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label><input type="text" value={person.phone} onChange={(e) => handleChange(e, 'contacts', index, 'phone')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="Phone" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Email</label><input type="email" value={person.email} onChange={(e) => handleChange(e, 'contacts', index, 'email')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="Email" /></div>
              
              {/* Delete Button */}
              {formData.contactPersons.length > 1 && (
                <button type="button" onClick={() => removeContactPerson(index)} className="md:mt-6 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-2 rounded-md">Remove</button>
              )}
            </div>
          ))}
        </div>

        {/* SECTION 4: Current Openings (DYNAMIC) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-[#092a49]">4. Initial Openings</h2>
            <button type="button" onClick={addOpening} className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-md font-bold hover:bg-green-100">+ Add Opening</button>
          </div>
          {formData.openings.map((job, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start mb-4 bg-gray-50 p-4 rounded-lg relative">
              <div className="md:col-span-2"><label className="block text-xs font-semibold text-gray-700 mb-1">Job Title</label><input type="text" value={job.title} onChange={(e) => handleChange(e, 'openings', index, 'title')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="e.g. React Developer" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Experience</label><input type="text" value={job.experience} onChange={(e) => handleChange(e, 'openings', index, 'experience')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="2-4 Years" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Salary Range</label><input type="text" value={job.salary} onChange={(e) => handleChange(e, 'openings', index, 'salary')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="8LPA - 12LPA" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Vacancies</label><input type="number" value={job.vacancies} onChange={(e) => handleChange(e, 'openings', index, 'vacancies')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="Count" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date</label><input type="date" value={job.expiryDate} onChange={(e) => handleChange(e, 'openings', index, 'expiryDate')} className="w-full p-2 border border-gray-300 rounded-md text-sm" /></div>
              <div className="md:col-span-5"><label className="block text-xs font-semibold text-gray-700 mb-1">Job Description</label><input type="text" value={job.description} onChange={(e) => handleChange(e, 'openings', index, 'description')} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="Short JD..." /></div>
              
              {formData.openings.length > 1 && (
                <button type="button" onClick={() => removeOpening(index)} className="md:mt-6 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-2 rounded-md">Remove</button>
              )}
            </div>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-[#0796fe] hover:bg-[#0680d9] text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? 'Saving Client...' : 'Save Complete Client Profile'}
          </button>
        </div>

      </form>
    </div>
  );
}