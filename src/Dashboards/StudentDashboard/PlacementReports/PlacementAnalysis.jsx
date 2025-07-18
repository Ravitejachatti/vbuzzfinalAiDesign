import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  FileText, 
  Download, 
  ExternalLink,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Users,
  Briefcase
} from 'lucide-react';

const PlacementAnalysis = () => {
  const studentData = useSelector((state) => state.student.data);
  console.log("Student Data:", studentData);
  const placements = studentData?.placements || [];

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalApplied = placements.length;
  const selectedCompanies = placements.filter(p => p.status === 'Hired');
  const totalSelected = selectedCompanies.length;
  const totalOfferLetters = selectedCompanies.filter(p => p.offerLetterLink).length;
  const pendingApplications = placements.filter(p => ['Applied', 'In Progress'].includes(p.status)).length;

  const avgCTC = totalSelected > 0 
    ? selectedCompanies.reduce((sum, p) => sum + (p.ctc || 0), 0) / totalSelected
    : 0;

  const highestCTC = totalSelected > 0 
    ? Math.max(...selectedCompanies.map(p => p.ctc || 0))
    : 0;

  const stats = [
    { title: 'Total Applications', value: totalApplied, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { title: 'Companies Selected', value: totalSelected, icon: Users, color: 'from-green-500 to-green-600' },
    { title: 'Offer Letters', value: totalOfferLetters, icon: Award, color: 'from-purple-500 to-purple-600' },
    { title: 'Pending Applications', value: pendingApplications, icon: Clock, color: 'from-yellow-500 to-yellow-600' }
  ];

  const getStatusIcon = (status) => {
    if (status === 'Hired') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (['Applied', 'In Progress'].includes(status)) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Hired') return 'bg-green-100 text-green-800 border-green-200';
    if (['Applied', 'In Progress'].includes(status)) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <p className="text-gray-600">Loading placement analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            Placement Analysis & Reports
          </h2>
          <p className="text-gray-600 mt-1">Analyze your placement journey and progress</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg border">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{s.title}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <div className={`p-2 rounded-xl bg-gradient-to-r ${s.color}`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance metrics */}
      {totalSelected > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg border p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-bold text-gray-900">Average CTC</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{avgCTC.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-bold text-gray-900">Highest CTC</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{highestCTC.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="border-b flex space-x-4 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'offers', label: 'Offers', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-3 text-sm font-medium ${
                activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <h4 className="text-sm font-medium text-blue-900">Success Rate</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {totalApplied > 0 ? Math.round((totalSelected / totalApplied) * 100) : 0}%
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <h4 className="text-sm font-medium text-green-900">Offer Conversion</h4>
                <p className="text-2xl font-bold text-green-600">
                  {totalSelected > 0 ? Math.round((totalOfferLetters / totalSelected) * 100) : 0}%
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <h4 className="text-sm font-medium text-purple-900">Active Applications</h4>
                <p className="text-2xl font-bold text-purple-600">{pendingApplications}</p>
              </div>
            </div>
          )}

          {/* Applications tab */}
          {activeTab === 'applications' && (
            placements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {placements.map((placement, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{idx + 1}</td>
                        <td className="px-4 py-2 flex items-center">
                          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                          {placement.companyName || '-'}
                        </td>
                        <td className="px-4 py-2">{placement.role || '-'}</td>
                        <td className="px-4 py-2">{placement.ctc ? `₹${placement.ctc.toLocaleString()}` : '-'}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(placement.status)}`}>
                            {getStatusIcon(placement.status)}
                            <span className="ml-1">{placement.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {placement.offerLetterLink ? (
                            <a href={placement.offerLetterLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View Offer
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">No applications yet</div>
            )
          )}

          {/* Offers tab */}
          {activeTab === 'offers' && (
            selectedCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCompanies.map((offer, idx) => (
                  <div key={idx} className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <h4 className="text-lg font-bold text-green-900">{offer.companyName}</h4>
                    <p className="text-green-700">{offer.role}</p>
                    <p className="font-semibold mt-2 text-green-800">₹{offer.ctc?.toLocaleString()}</p>
                    {offer.offerLetterLink && (
                      <a href={offer.offerLetterLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                        View Offer Letter
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">No offers yet</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementAnalysis;