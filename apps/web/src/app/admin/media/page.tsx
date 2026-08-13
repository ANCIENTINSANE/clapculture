'use client';

import { useState } from 'react';

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  size: string;
  date: string;
};

const MOCK_MEDIA: MediaItem[] = [];

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredMedia = media.filter(item => 
    item.filename.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard');
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to delete this file?')) {
      setMedia(media.filter(m => m.id !== id));
      showToast('File deleted');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#0a0a0a] min-h-screen relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#d2f000] text-black px-4 py-2 rounded-lg font-medium shadow-lg z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">{previewItem.filename}</h3>
              <button onClick={() => setPreviewItem(null)} className="text-[#a3a3a3] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-[#0a0a0a] rounded-lg flex items-center justify-center p-4">
              <img src={previewItem.url} alt={previewItem.filename} className="max-h-[60vh] object-contain" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-[#737373]">
                Uploaded {previewItem.date} • {previewItem.size}
              </div>
              <button 
                onClick={() => handleCopyUrl(previewItem.url)}
                className="bg-[#d2f000] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#b8d400]"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-[#a3a3a3]">Manage all images, videos, and files across your store.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737373] text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-white focus:border-[#d2f000] outline-none"
            />
          </div>
          <div className="flex bg-[#1a1a1a] border border-[#262626] rounded-lg p-1">
            <button 
              onClick={() => setView('grid')}
              className={`p-1 rounded flex items-center justify-center ${view === 'grid' ? 'bg-[#262626] text-white' : 'text-[#737373] hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-1 rounded flex items-center justify-center ${view === 'list' ? 'bg-[#262626] text-white' : 'text-[#737373] hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-[#141414] border-2 border-dashed border-[#262626] rounded-xl p-8 flex flex-col items-center justify-center text-center mb-8 hover:border-[#d2f000] hover:bg-[#1a1a1a] transition-all cursor-pointer">
        <div className="bg-[#1a1a1a] p-3 rounded-full mb-3">
          <span className="material-symbols-outlined text-[#d2f000] text-3xl">cloud_upload</span>
        </div>
        <h3 className="text-white font-medium text-lg mb-1">Click to upload or drag and drop</h3>
        <p className="text-[#737373] text-sm">SVG, PNG, JPG or GIF (max. 10MB)</p>
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl text-[#262626] mb-3">image_not_supported</span>
          <h3 className="text-white font-medium">No media found</h3>
          <p className="text-[#737373] text-sm mt-1">Try adjusting your search query.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map(item => (
            <div key={item.id} className="group relative bg-[#141414] border border-[#262626] rounded-lg overflow-hidden flex flex-col">
              <div className="aspect-square bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
                <img src={item.url} alt={item.filename} className="object-cover w-full h-full" />
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setPreviewItem(item)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full" title="Preview">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                  <button onClick={() => handleCopyUrl(item.url)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full" title="Copy URL">
                    <span className="material-symbols-outlined text-[18px]">link</span>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 p-2 rounded-full" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate mb-1">{item.filename}</p>
                <div className="flex justify-between items-center text-xs text-[#737373]">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
          <table className="w-full text-left divide-y divide-[#262626]">
            <thead>
              <tr className="bg-[#1a1a1a] text-[#737373] text-sm">
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Date Uploaded</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredMedia.map(item => (
                <tr key={item.id} className="hover:bg-[#1a1a1a] group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-white text-sm font-medium">{item.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a3a3a3]">{item.size}</td>
                  <td className="px-4 py-3 text-sm text-[#a3a3a3]">{item.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setPreviewItem(item)} className="text-[#a3a3a3] hover:text-white" title="Preview">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button onClick={() => handleCopyUrl(item.url)} className="text-[#a3a3a3] hover:text-white" title="Copy URL">
                        <span className="material-symbols-outlined text-[18px]">link</span>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-[#a3a3a3] hover:text-red-500" title="Delete">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}