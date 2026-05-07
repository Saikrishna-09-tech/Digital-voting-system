import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Trash2, Plus, ArrowLeft, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { candidateService, electionService } from '../services/api';
import { blockchainService } from '../blockchain/blockchainService';

export default function ManageCandidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    image: null,
    imagePreview: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      try {
        await blockchainService.connectWallet();
      } catch (walletError) {
        console.warn('Wallet connection failed (expected if no MetaMask):', walletError.message);
      }

      const resStatus = await electionService.getStatus();
      setElectionStatus(resStatus.data);

      const resCandidates = await candidateService.getAllCandidates();
      setCandidates(resCandidates.data.candidates);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data from server. Please check backend or network.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.party || !formData.image) {
      toast.error('Please fill all fields');
      return;
    }

    if (electionStatus?.status === 'ACTIVE') {
      toast.error('Cannot add candidates while election is active');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image
      const uploadRes = await candidateService.uploadImage(formData.image);
      const imageUrl = uploadRes.data.imageUrl;

      // Save to database
      await candidateService.addCandidate(formData.name, formData.party, imageUrl);

      // Try to add to blockchain (optional - won't fail form submission if blockchain fails)
      try {
        await blockchainService.addCandidate(formData.name, formData.party, imageUrl);
      } catch (blockchainError) {
        console.warn('Blockchain add candidate failed, but candidate saved to database:', blockchainError);
      }

      toast.success('Candidate added successfully!');
      setFormData({ name: '', party: '', image: null, imagePreview: null });
      setShowAddForm(false);
      loadData();
    } catch (error) {
      console.error('Candidate add error:', error);
      toast.error(error.response?.data?.message || 'Failed to add candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (electionStatus?.status === 'ACTIVE') {
      toast.error('Cannot delete candidates while election is active');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    try {
      await candidateService.deleteCandidate(id);
      toast.success('Candidate deleted!');
      loadData();
    } catch (error) {
      toast.error('Failed to delete candidate');
    }
  };

  const handleEditClick = (candidate) => {
    setEditingId(candidate.id || candidate._id);
    setFormData({
      name: candidate.name,
      party: candidate.party,
      image: null,
      imagePreview: candidate.image,
    });
    setShowEditForm(true);
  };

  const handleEditCandidate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.party) {
      toast.error('Please fill all fields');
      return;
    }

    if (electionStatus?.status === 'ACTIVE') {
      toast.error('Cannot edit candidates while election is active');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.imagePreview;

      // Upload new image if selected
      if (formData.image) {
        const uploadRes = await candidateService.uploadImage(formData.image);
        imageUrl = uploadRes.data.imageUrl;
      }

      // Update in database
      await candidateService.updateCandidate(editingId, formData.name, formData.party, imageUrl);

      toast.success('Candidate updated successfully!');
      setFormData({ name: '', party: '', image: null, imagePreview: null });
      setShowEditForm(false);
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error(error.response?.data?.message || 'Failed to edit candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  const totalPages = Math.ceil(candidates.length / candidatesPerPage);
  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Manage Candidates</h1>
            <p className="text-gray-400 mt-2">Total: {candidates.length} candidates</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus size={20} />
            Add Candidate
          </button>
        </div>

        {/* Add Candidate Form */}
        {showAddForm && (
          <motion.form
            onSubmit={handleAddCandidate}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl mb-8 space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">Add New Candidate</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Candidate Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />

              <input
                type="text"
                placeholder="Party Name"
                value={formData.party}
                onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Adding...' : 'Add Candidate'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* Edit Candidate Form */}
        {showEditForm && (
          <motion.form
            onSubmit={handleEditCandidate}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl mb-8 space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">Edit Candidate</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Candidate Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />

              <input
                type="text"
                placeholder="Party Name"
                value={formData.party}
                onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Update Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Updating...' : 'Update Candidate'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingId(null);
                  setFormData({ name: '', party: '', image: null, imagePreview: null });
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedCandidates.map((candidate, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl"
            >
              <img
                src={candidate.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={candidate.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
              <p className="text-gray-400 mb-6">{candidate.party}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(candidate)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCandidate(candidate.id || candidate._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex gap-2 justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  page === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
