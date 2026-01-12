
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800">{recipe.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            recipe.difficulty === '쉬움' ? 'bg-green-100 text-green-700' : 
            recipe.difficulty === '보통' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
        <p className="text-slate-600 text-sm mb-4">{recipe.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <i className="fa-regular fa-clock"></i> {recipe.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-list-check"></i> {recipe.ingredients.length}개 재료
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-sm text-slate-700 mb-2">필요한 재료</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.map((ing, idx) => (
                <span key={idx} className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-xs border border-slate-100">
                  {ing}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-sm text-slate-700 mb-2">조리 방법</h4>
            <ol className="text-sm text-slate-600 space-y-2">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-bold text-orange-500">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
