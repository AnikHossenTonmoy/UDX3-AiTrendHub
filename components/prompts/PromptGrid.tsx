import React from 'react';
import { Prompt } from '../../types';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: Prompt[];
  savedPromptIds: Set<string>;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onPromptClick: (id: string) => void;
}

const PromptGrid: React.FC<PromptGridProps> = ({
  prompts,
  savedPromptIds,
  onToggleSave,
  onPromptClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
      {prompts.map((prompt, index) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          isSaved={savedPromptIds.has(prompt.id)}
          onToggleSave={onToggleSave}
          onClick={() => onPromptClick(prompt.id)}
          index={index}
        />
      ))}
    </div>
  );
};

export default PromptGrid;
