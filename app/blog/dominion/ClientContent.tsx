'use client';

import { useState } from 'react';
import MDXContent from '../../components/MDXContent';
import Content from './content.mdx';
import DominionGame from './DominionGame';

export default function ClientContent() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <MDXContent>
        <Content />
      </MDXContent>
      
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
        {!showGame ? (
          <div className="text-center">
            <button
              onClick={() => setShowGame(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Start New Game
            </button>
          </div>
        ) : (
          <DominionGame />
        )}
      </div>
    </div>
  );
}