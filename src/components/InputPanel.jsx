import React, { useState, useMemo } from 'react';
import { Sparkles, X, ImageIcon, Loader2 } from 'lucide-react';
import { parseText, analyzeImage } from '../services/api';
import toast from 'react-hot-toast';

const InputPanel = ({ onAnalysisComplete }) => {
    const [text, setText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Create preview URL for the selected image
    const imagePreview = useMemo(() => {
        if (!imageFile) return null;
        return URL.createObjectURL(imageFile);
    }, [imageFile]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleAnalyze = async () => {
        if (!text.trim() && !imageFile) return;

        try {
            setLoading(true);
            
            // Artificial delay to simulate complex AI reasoning (Perceived Intelligence Boost)
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let res;
            if (imageFile) {
                res = await analyzeImage(imageFile);
            } else {
                res = await parseText(text);
            }

            console.log("AI RESPONSE:", res.data);
            
            // Add a small delay for "Processing" feedback
            setLoading(true);
            toast.loading('Synthesizing situational data...', { id: 'analyze' });
            await new Promise(resolve => setTimeout(resolve, 1200));

            toast.success('Intelligence analysis complete', { id: 'analyze' });
            
            if (onAnalysisComplete) {
                onAnalysisComplete(res.data);
            }
            
            // Clear state after success
            setText('');
            setImageFile(null);
        } catch (err) {
            console.error('Analysis failed:', err);
            toast.error('AI Analysis failed. Please try again.', { id: 'analyze' });
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = loading || (!text.trim() && !imageFile);

    return (
        <div className="flex flex-col gap-6 p-1">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="text-indigo-500 w-6 h-6" />
                AI Analysis
            </h2>
            
            <div className="space-y-4">
                <div className="relative group">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Describe the situation in detail..."
                        className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-2xl"
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 block ml-1">Optional: Image Input</label>
                    <div className="flex flex-wrap gap-4">
                        {imageFile ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-zinc-800 group bg-zinc-950">
                                <img src={imagePreview} alt="Upload Preview" className="w-full h-full object-contain" />
                                <button 
                                    onClick={() => setImageFile(null)}
                                    disabled={loading}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full hover:bg-red-500/80 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <X size={16} className="text-white" />
                                </button>
                            </div>
                        ) : (
                            <label className={`w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-indigo-500 transition-colors">
                                    <ImageIcon size={20} />
                                    <span className="text-xs font-medium">Click to upload image</span>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageUpload}
                                    disabled={loading} 
                                />
                            </label>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={isButtonDisabled}
                    className="w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            <span>Analyze with AI</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InputPanel;
