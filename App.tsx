
import React, { useState } from 'react';
import { MealTime, Ingredient, Recipe } from './types';
import { generateRecipes } from './services/geminiService';
import { RecipeCard } from './components/RecipeCard';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedMealTime, setSelectedMealTime] = useState<MealTime>(MealTime.LUNCH);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: inputValue.trim(),
    };
    setIngredients([...ingredients, newIngredient]);
    setInputValue('');
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleRecommend = async () => {
    if (ingredients.length === 0) {
      alert('재료를 하나 이상 입력해주세요!');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const ingredientNames = ingredients.map(i => i.name);
      const result = await generateRecipes(ingredientNames, selectedMealTime);
      setRecipes(result.recipes);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '레시피를 생성하는 중 오류가 발생했습니다. Vercel 환경 변수(API_KEY) 설정을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <i className="fa-solid fa-utensils text-white"></i>
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Fridge Chef</h1>
          </div>
          <div className="text-slate-400 text-sm font-medium hidden sm:block">
            냉장고 파먹기 도우미
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">1</span>
            <h2 className="text-lg font-bold">냉장고에 어떤 재료가 있나요?</h2>
          </div>
          
          <form onSubmit={addIngredient} className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="예: 계란, 두부, 김치..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              추가
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {ingredients.length === 0 ? (
              <p className="text-slate-400 text-sm py-4 italic">아직 추가된 재료가 없습니다.</p>
            ) : (
              ingredients.map((ing) => (
                <div key={ing.id} className="group flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg border border-orange-100">
                  <span className="font-medium">{ing.name}</span>
                  <button 
                    onClick={() => removeIngredient(ing.id)}
                    className="text-orange-300 hover:text-orange-500 transition-colors"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">2</span>
            <h2 className="text-lg font-bold">지금은 무슨 식사 시간인가요?</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Object.values(MealTime).map((time) => (
              <button
                key={time}
                onClick={() => setSelectedMealTime(time)}
                className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedMealTime === time 
                    ? 'border-orange-500 bg-orange-50 text-orange-600' 
                    : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
              >
                <i className={`text-xl ${
                  time === MealTime.BREAKFAST ? 'fa-solid fa-sun' :
                  time === MealTime.LUNCH ? 'fa-solid fa-cloud-sun' : 'fa-solid fa-moon'
                }`}></i>
                <span className="font-bold">{time}</span>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleRecommend}
          disabled={isLoading || ingredients.length === 0}
          className={`w-full py-5 rounded-3xl font-extrabold text-xl shadow-lg transition-all transform active:scale-95 ${
            isLoading || ingredients.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-200'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <i className="fa-solid fa-spinner fa-spin"></i> 레시피 구상 중...
            </span>
          ) : (
            '최고의 레시피 3가지 제안받기'
          )}
        </button>

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-medium border border-red-100">
            <i className="fa-solid fa-circle-exclamation mb-2 text-2xl block"></i>
            {error}
          </div>
        )}

        {recipes.length > 0 && (
          <div id="results" className="space-y-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-800">추천 레시피</h2>
              <span className="text-sm text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{selectedMealTime}에 딱 맞는 요리</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            <button 
              onClick={() => {
                setRecipes([]);
                setIngredients([]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-4 text-slate-400 font-medium hover:text-slate-600 transition-colors"
            >
              처음부터 다시 시작하기
            </button>
          </div>
        )}
      </main>

      <footer className="mt-20 py-10 text-center border-t border-slate-100 bg-white">
        <p className="text-slate-400 text-sm">© 2024 Fridge Chef. AI Powered Recipes.</p>
      </footer>
    </div>
  );
};

export default App;
