"use client";

import React, { useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { CompletionProof } from '@/lib/types/booking';

interface CompletionModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (id: string, proof: CompletionProof[]) => Promise<void>;
  bookingId: string;
  userRole: 'client' | 'worker';
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  show,
  onClose,
  onSubmit,
  bookingId,
  userRole
}) => {
  const [completionProof, setCompletionProof] = useState<CompletionProof[]>([]);

  const addCompletionProof = () => {
    const newProof: CompletionProof = {
      id: Date.now().toString(),
      booking_id: bookingId,
      type: 'text',
      description: '',
      uploaded_at: new Date().toISOString()
    };
    setCompletionProof([...completionProof, newProof]);
  };

  const updateCompletionProof = (index: number, field: keyof CompletionProof, value: string) => {
    const updated = [...completionProof];
    updated[index] = { ...updated[index], [field]: value };
    setCompletionProof(updated);
  };

  const removeCompletionProof = (index: number) => {
    setCompletionProof(completionProof.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    await onSubmit(bookingId, completionProof);
    onClose();
    setCompletionProof([]);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {userRole === 'client' ? 'Mark Job as Complete' : 'Submit Work Completion'}
          </h3>
          <p className="text-gray-600 mb-6">
            {userRole === 'client' 
              ? 'Please provide evidence that the job has been completed satisfactorily.'
              : 'Submit proof that you have completed the work as agreed.'
            }
          </p>
          
          <div className="mb-6">
            <div className="space-y-4">
              {completionProof.map((proof, index) => (
                <div key={proof.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      value={proof.type}
                      onChange={(e) => updateCompletionProof(index, 'type', e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="text">Text Description</option>
                      <option value="image">Image</option>
                      <option value="document">Document</option>
                      <option value="video">Video</option>
                    </select>
                    <button
                      onClick={() => removeCompletionProof(index)}
                      className="text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <textarea
                    value={proof.description}
                    onChange={(e) => updateCompletionProof(index, 'description', e.target.value)}
                    placeholder="Describe the completed work, any challenges faced, and the final outcome..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {proof.type !== 'text' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload {proof.type}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          accept={proof.type === 'image' ? 'image/*' : proof.type === 'video' ? 'video/*' : '*/*'}
                          className="hidden"
                          onChange={(e) => {
                            console.log('File selected:', e.target.files?.[0]);
                          }}
                        />
                        <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Choose File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <button
                onClick={addCompletionProof}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 bg-white"
              >
                <Plus className="h-5 w-5" />
                Add More Evidence
              </button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={completionProof.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {userRole === 'client' ? 'Mark Complete' : 'Submit Completion'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};