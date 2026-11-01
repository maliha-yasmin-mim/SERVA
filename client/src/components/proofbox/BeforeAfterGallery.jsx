import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Eye } from 'lucide-react';
import Modal from '../common/Modal';

const BeforeAfterGallery = ({ beforeImages = [], afterImages = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before Work Column */}
        <div className="bg-[#F7F9F8] rounded-2xl border border-[#E3EAE7] p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3EAE7]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="text-sm font-bold text-[#17211F] font-display">
                PRE-WORK EVIDENCE (BEFORE)
              </h4>
            </div>
            <span className="text-xs text-[#64716D] font-medium">
              {beforeImages.length} Photo{beforeImages.length === 1 ? '' : 's'}
            </span>
          </div>

          {beforeImages.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64716D] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E3EAE7] rounded-xl bg-white">
              <Camera className="w-6 h-6 text-gray-400" />
              <span>No pre-work evidence photos uploaded yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {beforeImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="group relative rounded-xl overflow-hidden border border-[#E3EAE7] bg-white cursor-pointer hover:shadow-md transition-all"
                >
                  <img
                    src={img.url}
                    alt={`Before work ${idx + 1}`}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-5 h-5" />
                  </div>
                  {img.note && (
                    <div className="p-2 text-[11px] text-[#17211F] truncate font-medium bg-white">
                      {img.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* After Work Column */}
        <div className="bg-[#E6F4F2]/40 rounded-2xl border border-[#0F766E]/20 p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#0F766E]/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold text-[#0F766E] font-display">
                COMPLETION EVIDENCE (AFTER)
              </h4>
            </div>
            <span className="text-xs text-[#0F766E] font-medium">
              {afterImages.length} Photo{afterImages.length === 1 ? '' : 's'}
            </span>
          </div>

          {afterImages.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64716D] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#0F766E]/30 rounded-xl bg-white">
              <Camera className="w-6 h-6 text-teal-400" />
              <span>No completion photos uploaded yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {afterImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="group relative rounded-xl overflow-hidden border border-teal-200 bg-white cursor-pointer hover:shadow-md transition-all"
                >
                  <img
                    src={img.url}
                    alt={`After work ${idx + 1}`}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-5 h-5" />
                  </div>
                  {img.note && (
                    <div className="p-2 text-[11px] text-[#17211F] truncate font-medium bg-white">
                      {img.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Evidence Photographic Record"
        subtitle={selectedImage?.note || 'Uploaded photographic proof via SERVA ProofBox'}
        maxWidth="max-w-2xl"
      >
        {selectedImage && (
          <div className="space-y-3">
            <img
              src={selectedImage.url}
              alt="Evidence Full View"
              className="w-full max-h-[60vh] object-contain rounded-xl bg-black"
            />
            {selectedImage.uploadedAt && (
              <p className="text-xs text-[#64716D] text-right">
                Captured on {new Date(selectedImage.uploadedAt).toLocaleString('en-GB')}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BeforeAfterGallery;
