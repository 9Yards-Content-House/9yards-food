import { useState, useEffect } from 'react';
import { X, Check, ChevronRight, Plus, Minus, ArrowLeft } from 'lucide-react';
import { menuData, Sauce } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart, CartItem, SauceSelection, ExtraItem } from '@/context/CartContext';
import { toast } from 'sonner';
import { vibrate } from '@/lib/utils/ui';

interface ComboBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComboBuilder({ isOpen, onClose }: ComboBuilderProps) {
  const [step, setStep] = useState(1);
  const [selectedMainDishes, setSelectedMainDishes] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<Sauce | null>(null);
  const [saucePreparation, setSaucePreparation] = useState<string>('');
  const [sauceSize, setSauceSize] = useState<{ name: string; price: number } | null>(null);
  const [selectedSideDish, setSelectedSideDish] = useState<string>('');
  const [selectedJuices, setSelectedJuices] = useState<{ id: string; quantity: number }[]>([]);
  const [selectedDesserts, setSelectedDesserts] = useState<{ id: string; quantity: number }[]>([]);

  const { addItem } = useCart();

  const resetBuilder = () => {
    setStep(1);
    setSelectedMainDishes([]);
    setSelectedSauce(null);
    setSaucePreparation('');
    setSauceSize(null);
    setSelectedSideDish('');
    setSelectedJuices([]);
    setSelectedDesserts([]);
  };

  const handleClose = () => {
    resetBuilder();
    onClose();
  };

  // Keyboard navigation - Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMainDish = (id: string) => {
    setSelectedMainDishes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const updateJuiceQuantity = (id: string, delta: number) => {
    setSelectedJuices((prev) => {
      const existing = prev.find((j) => j.id === id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((j) => j.id !== id);
        }
        return prev.map((j) => (j.id === id ? { ...j, quantity: newQty } : j));
      }
      if (delta > 0) {
        return [...prev, { id, quantity: 1 }];
      }
      return prev;
    });
  };

  const updateDessertQuantity = (id: string, delta: number) => {
    setSelectedDesserts((prev) => {
      const existing = prev.find((d) => d.id === id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((d) => d.id !== id);
        }
        return prev.map((d) => (d.id === id ? { ...d, quantity: newQty } : d));
      }
      if (delta > 0) {
        return [...prev, { id, quantity: 1 }];
      }
      return prev;
    });
  };

  const calculateTotal = () => {
    let total = sauceSize?.price || 0;

    selectedJuices.forEach((j) => {
      const juice = menuData.juices.find((jc) => jc.id === j.id);
      if (juice) total += juice.price * j.quantity;
    });

    selectedDesserts.forEach((d) => {
      const dessert = menuData.desserts.find((ds) => ds.id === d.id);
      if (dessert) total += dessert.price * d.quantity;
    });

    return total;
  };

  const handleAddToCart = () => {
    const mainDishNames = selectedMainDishes
      .map((id) => menuData.mainDishes.find((d) => d.id === id)?.name)
      .filter(Boolean) as string[];

    const sideDishName =
      menuData.sideDishes.find((s) => s.id === selectedSideDish)?.name || '';

    const sauceSelection: SauceSelection | null = selectedSauce && sauceSize
      ? {
          id: selectedSauce.id,
          name: selectedSauce.name,
          preparation: saucePreparation,
          size: sauceSize.name,
          price: sauceSize.price,
        }
      : null;

    const extras: ExtraItem[] = [
      ...selectedJuices.map((j) => {
        const juice = menuData.juices.find((jc) => jc.id === j.id)!;
        return { id: j.id, name: juice.name, quantity: j.quantity, price: juice.price };
      }),
      ...selectedDesserts.map((d) => {
        const dessert = menuData.desserts.find((ds) => ds.id === d.id)!;
        return { id: d.id, name: dessert.name, quantity: d.quantity, price: dessert.price };
      }),
    ];

    const cartItem: CartItem = {
      id: `combo-${Date.now()}`,
      type: 'combo',
      mainDishes: mainDishNames,
      sauce: sauceSelection,
      sideDish: sideDishName,
      extras,
      quantity: 1,
      totalPrice: calculateTotal(),
    };

    addItem(cartItem);
    vibrate(50);
    toast.success('Combo added to order!');
    handleClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedMainDishes.length > 0;
      case 2:
        return selectedSauce && saucePreparation && sauceSize;
      case 3:
        return selectedSideDish !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Get summary text for footer
  const getSummaryText = () => {
    const mainNames = selectedMainDishes
      .map((id) => menuData.mainDishes.find((d) => d.id === id)?.name)
      .filter(Boolean);
    
    if (step === 1) {
      return mainNames.length > 0 ? mainNames.join(', ') : 'Select your food';
    }
    
    if (step === 2 && selectedSauce && sauceSize) {
      // Don't show preparation in summary if it's 'Default' (sauce has no prep options)
      const prepText = saucePreparation && saucePreparation !== 'Default' ? `${saucePreparation}, ` : '';
      // Don't show size in summary if sauce only has one size option
      const sizeText = selectedSauce.sizes.length > 1 ? sauceSize.name : '';
      const optionsText = prepText || sizeText ? ` (${prepText}${sizeText})` : '';
      return `${mainNames.join(' + ')} + ${selectedSauce.name}${optionsText}`;
    }
    
    if (step >= 3) {
      const sideName = menuData.sideDishes.find((s) => s.id === selectedSideDish)?.name;
      const parts = [...mainNames];
      if (selectedSauce) parts.push(selectedSauce.name);
      if (sideName) parts.push(sideName);
      return parts.join(' + ');
    }
    
    return mainNames.join(', ');
  };

  const getNextButtonText = () => {
    switch (step) {
      case 1:
        return 'Next: Choose Your Sauce';
      case 2:
        return 'Next: Choose Your Side Dish';
      case 3:
        return 'Next: Add Extras';
      case 4:
        return 'Add to Order';
      default:
        return 'Next';
    }
  };

  // Calculate extras count
  const extrasCount = selectedJuices.reduce((acc, j) => acc + j.quantity, 0) + 
                      selectedDesserts.reduce((acc, d) => acc + d.quantity, 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-md md:max-w-2xl lg:max-w-3xl h-[95vh] md:h-[90vh] md:max-h-[800px] bg-[#FAFAFA] md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="combo-builder-title"
          >
            {/* Header */}
            <header className="flex-none bg-white px-4 pt-4 pb-3 shadow-sm z-20 border-b border-gray-100">
              <div className="flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex size-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-[#212282]"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    className="flex size-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-[#212282]"
                    aria-label="Close combo builder"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E6411C]">
                    Step {step} of 4
                  </span>
                  <div className="mt-1.5 flex gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          s === step ? 'w-8 bg-[#E6411C]' : s < step ? 'w-2 bg-[#212282]' : 'w-2 bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-10 items-center justify-center rounded-full px-2 hover:bg-red-50 transition-colors"
                >
                  <span className="text-[#E6411C] text-sm font-bold">Cancel</span>
                </button>
              </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto pb-44 md:pb-48">
              {/* Step 1: Choose Your Food */}
              {step === 1 && (
                <div className="animate-in fade-in duration-300">
                  <div className="px-5 pt-5 pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 id="combo-builder-title" className="text-[28px] font-extrabold leading-tight tracking-tight text-[#212282]">
                        Choose Your Food
                      </h1>
                      {selectedMainDishes.length > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-[#E6411C] text-white text-sm font-bold">
                          {selectedMainDishes.length} selected
                        </span>
                      )}
                    </div>
                    <p className="text-base text-gray-500 font-medium">
                      Choose as many as you like. They're all included!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 px-4 py-4 md:grid-cols-3 lg:grid-cols-4">
                    {menuData.mainDishes.map((dish) => {
                      const isSelected = selectedMainDishes.includes(dish.id);
                      return (
                        <label
                          key={dish.id}
                          className={`group relative cursor-pointer block ${!dish.available && 'opacity-50 pointer-events-none'}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMainDish(dish.id)}
                            className="sr-only"
                            disabled={!dish.available}
                          />
                          <div className={`flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-white transition-all duration-200 ${
                            isSelected ? 'border-[#E6411C] bg-[#E6411C]/5' : 'border-gray-200 hover:border-[#E6411C]'
                          }`}>
                            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              {/* Checkmark Badge */}
                              <div className={`absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-[#E6411C] text-white shadow-lg transition-all duration-300 ${
                                isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                              }`}>
                                <Check className="w-4 h-4" strokeWidth={3} />
                              </div>
                            </div>
                            <div className="flex flex-col p-3">
                              <span className="text-sm font-bold text-[#212282]">{dish.name}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Your Sauce */}
              {step === 2 && (
                <div className="animate-in fade-in duration-300">
                  <div className="px-5 pt-5 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-[#212282] tracking-tight">Choose Your Sauce</h1>
                      <span className="px-2 py-0.5 rounded-full bg-[#E6411C]/10 text-[#E6411C] text-[10px] font-bold uppercase tracking-wider border border-[#E6411C]/20">
                        Required
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Select one sauce to accompany your meal.</p>
                  </div>

                  <div className="flex flex-col gap-3 p-4">
                    {menuData.sauces.map((sauce) => {
                      const isSelected = selectedSauce?.id === sauce.id;
                      return (
                        <div
                          key={sauce.id}
                          className={`group relative flex flex-col rounded-xl border-2 bg-white transition-all duration-300 shadow-sm overflow-hidden ${
                            isSelected ? 'border-[#E6411C] bg-[#E6411C]/[0.03]' : 'border-gray-100 hover:border-[#E6411C]/50'
                          } ${!sauce.available && 'opacity-50 pointer-events-none'}`}
                        >
                          {/* Main Click Area */}
                          <label className="flex items-center gap-4 p-4 cursor-pointer">
                            <img
                              src={sauce.image}
                              alt={sauce.name}
                              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-[#212282] font-bold text-lg">{sauce.name}</h3>
                                  <p className="text-gray-500 text-sm mt-0.5">from {formatPrice(sauce.basePrice)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="relative flex items-center justify-center w-6 h-6">
                              <input
                                type="radio"
                                name="sauce"
                                checked={isSelected}
                                onChange={() => {
                                  setSelectedSauce(sauce);
                                  // Auto-select preparation if only one, or set default if none
                                  if (sauce.preparations.length === 1) {
                                    setSaucePreparation(sauce.preparations[0]);
                                  } else if (sauce.preparations.length === 0) {
                                    setSaucePreparation('Default');
                                  } else {
                                    setSaucePreparation('');
                                  }
                                  // Auto-select size if only one
                                  if (sauce.sizes.length === 1) {
                                    setSauceSize(sauce.sizes[0]);
                                  } else {
                                    setSauceSize(null);
                                  }
                                }}
                                className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:border-[#E6411C] checked:border-[6px] transition-all bg-white"
                                disabled={!sauce.available}
                              />
                            </div>
                          </label>

                          {/* Expanded Sub-options */}
                          {isSelected && (
                            <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                              {/* Only show divider and options if there are preparations or multiple sizes */}
                              {(sauce.preparations.length > 0 || sauce.sizes.length > 1) && (
                                <>
                                  <div className="h-px w-full bg-[#E6411C]/10 mb-4" />
                                  
                                  {/* Preparation Style - only show if there are preparations */}
                                  {sauce.preparations.length > 0 && (
                                    <div className="mb-4">
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                        Preparation Style
                                      </label>
                                      <div className="flex flex-wrap gap-2">
                                        {sauce.preparations.map((prep) => (
                                          <button
                                            key={prep}
                                            onClick={() => setSaucePreparation(prep)}
                                            className={`px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold ${
                                              saucePreparation === prep
                                                ? 'border-[#E6411C] bg-[#E6411C] text-white'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-[#E6411C]/50'
                                            }`}
                                          >
                                            {prep}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Portion Size - only show if there are multiple sizes */}
                                  {sauce.sizes.length > 1 && (
                                    <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                        Portion Size
                                      </label>
                                      <div className="flex flex-col gap-2">
                                        {sauce.sizes.map((size) => (
                                          <label
                                            key={size.name}
                                            className={`flex items-center justify-between p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                                              sauceSize?.name === size.name
                                                ? 'border-[#E6411C] bg-[#E6411C]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                          >
                                            <div className="flex flex-col">
                                              <span className="text-sm font-medium text-gray-700">{size.name}</span>
                                              <span className="text-xs text-[#E6411C] font-semibold">
                                                {formatPrice(size.price)}
                                              </span>
                                            </div>
                                            <input
                                              type="radio"
                                              name="size"
                                              checked={sauceSize?.name === size.name}
                                              onChange={() => setSauceSize(size)}
                                              className="w-5 h-5 text-[#E6411C] border-gray-300 focus:ring-[#E6411C]"
                                            />
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Choose Your FREE Side Dish */}
              {step === 3 && (
                <div className="animate-in fade-in duration-300">
                  <div className="px-5 pt-5 pb-3">
                    <h1 className="text-[28px] font-extrabold leading-[1.1] text-[#212282] mb-2">
                      Choose Your <span className="text-[#E6411C]">FREE</span> Side Dish
                    </h1>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Every order comes with a free side dish of your choice! Select one option to complete your meal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 px-4 pb-4">
                    {menuData.sideDishes.map((side) => {
                      const isSelected = selectedSideDish === side.id;
                      return (
                        <label
                          key={side.id}
                          className={`group relative cursor-pointer block ${!side.available && 'opacity-50 pointer-events-none'}`}
                        >
                          <input
                            type="radio"
                            name="side-dish"
                            checked={isSelected}
                            onChange={() => setSelectedSideDish(side.id)}
                            className="sr-only"
                            disabled={!side.available}
                          />
                          <div className={`flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                            isSelected ? 'border-[#E6411C] bg-[#FFF8F6]' : 'border-transparent'
                          }`}>
                            <div className="relative flex-shrink-0">
                              <img
                                src={side.image}
                                alt={side.name}
                                className="w-20 h-20 rounded-xl object-cover shadow-inner"
                              />
                              <span className="absolute -top-2 -left-2 bg-[#E6411C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide border border-white">
                                Free
                              </span>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 py-1">
                              <p className="text-[#212282] text-lg font-bold leading-tight truncate pr-2">
                                {side.name}
                              </p>
                              <p className="text-[#E6411C] text-xs font-bold mt-1.5 uppercase tracking-wide">
                                Included
                              </p>
                            </div>
                            <div className="flex-shrink-0 pr-2">
                              <div className={`w-6 h-6 rounded-full border-2 relative transition-colors ${
                                isSelected ? 'border-[#E6411C] bg-[#E6411C]' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Add Extras */}
              {step === 4 && (
                <div className="animate-in fade-in duration-300">
                  <div className="px-4 pt-5 pb-3">
                    <h1 className="text-[#212282] tracking-tight text-[28px] font-extrabold leading-tight">
                      Add Extras <span className="text-gray-400 font-medium text-xl ml-1">(Optional)</span>
                    </h1>
                  </div>

                  {/* Natural Juices Section */}
                  <section className="mb-6">
                    <div className="px-4 mb-3 flex justify-between items-end">
                      <div>
                        <h3 className="text-[#212282] text-xl font-bold leading-tight tracking-tight">Natural Juice</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Freshly squeezed • 100% Natural</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4">
                      {menuData.juices.map((juice) => {
                        const selected = selectedJuices.find((j) => j.id === juice.id);
                        const isSelected = !!selected;
                        return (
                          <div
                            key={juice.id}
                            className={`group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border-2 transition-all ${
                              isSelected ? 'border-[#E6411C]' : 'border-gray-100 hover:border-gray-200'
                            } ${!juice.available && 'opacity-50 pointer-events-none'}`}
                          >
                            <div className="absolute top-2 left-2 z-10 bg-[#212282] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wider">
                              100% Natural
                            </div>
                            <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
                              <img
                                src={juice.image}
                                alt={juice.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-3 flex flex-col flex-1 justify-between">
                              <div className="mb-2">
                                <p className="text-[#212282] text-base font-bold leading-tight">{juice.name}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{formatPrice(juice.price)}</p>
                              </div>
                              {isSelected ? (
                                <div className="flex items-center justify-between bg-[#E6411C]/10 rounded-lg p-1">
                                  <button
                                    onClick={() => updateJuiceQuantity(juice.id, -1)}
                                    className="size-8 flex items-center justify-center rounded-md bg-white text-[#E6411C] shadow-sm hover:scale-105 transition-transform"
                                    aria-label={`Decrease ${juice.name} quantity`}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-[#E6411C] font-bold text-sm w-6 text-center">
                                    {selected.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateJuiceQuantity(juice.id, 1)}
                                    className="size-8 flex items-center justify-center rounded-md bg-[#E6411C] text-white shadow-sm hover:scale-105 transition-transform"
                                    aria-label={`Increase ${juice.name} quantity`}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => updateJuiceQuantity(juice.id, 1)}
                                  className="w-full h-9 flex items-center justify-center rounded-xl border border-gray-200 text-[#212282] text-sm font-bold hover:bg-gray-50 transition-colors"
                                >
                                  Add +
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Divider */}
                  <div className="h-2 bg-gray-100 w-full mb-6" />

                  {/* Desserts Section */}
                  <section className="mb-4">
                    <div className="px-4 mb-3">
                      <h3 className="text-[#212282] text-xl font-bold leading-tight tracking-tight">Desserts</h3>
                      <p className="text-gray-500 text-sm font-medium mt-1">Sweet finish</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4">
                      {menuData.desserts.map((dessert) => {
                        const selected = selectedDesserts.find((d) => d.id === dessert.id);
                        const isSelected = !!selected;
                        return (
                          <div
                            key={dessert.id}
                            className={`group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border-2 transition-all ${
                              isSelected ? 'border-[#E6411C]' : 'border-gray-100 hover:border-gray-200'
                            } ${!dessert.available && 'opacity-50 pointer-events-none'}`}
                          >
                            <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                              <img
                                src={dessert.image}
                                alt={dessert.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                              <div className="flex-1 mb-2">
                                <p className="text-[#212282] text-base font-bold leading-tight">{dessert.name}</p>
                                <p className="text-gray-500 text-sm">{formatPrice(dessert.price)}</p>
                              </div>
                              {isSelected ? (
                                <div className="flex items-center justify-between bg-[#E6411C]/10 rounded-lg p-1">
                                  <button
                                    onClick={() => updateDessertQuantity(dessert.id, -1)}
                                    className="size-8 flex items-center justify-center rounded-md bg-white text-[#E6411C] shadow-sm hover:scale-105 transition-transform"
                                    aria-label={`Decrease ${dessert.name} quantity`}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-[#E6411C] font-bold text-sm w-6 text-center">
                                    {selected.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateDessertQuantity(dessert.id, 1)}
                                    className="size-8 flex items-center justify-center rounded-md bg-[#E6411C] text-white shadow-sm hover:scale-105 transition-transform"
                                    aria-label={`Increase ${dessert.name} quantity`}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => updateDessertQuantity(dessert.id, 1)}
                                  className="w-full h-9 flex items-center justify-center rounded-xl border border-gray-200 text-[#212282] text-sm font-bold hover:bg-gray-50 transition-colors"
                                >
                                  Add +
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}
            </main>

            {/* Sticky Footer */}
            <footer className="absolute bottom-0 left-0 right-0 z-30">
              <div className={`p-4 pb-6 md:pb-4 ${
                step >= 2 ? 'bg-[#212282]' : 'bg-white border-t border-gray-100'
              }`}>
                <div className="flex flex-col gap-3 max-w-xl mx-auto">
                  {/* Order Summary */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        step >= 2 ? 'text-white/60' : 'text-gray-500'
                      }`}>
                        {step === 4 ? 'Order Summary' : 'Your Combo'}
                      </p>
                      {step === 4 ? (
                        <div className={`flex items-center gap-1 text-sm font-bold ${
                          step >= 2 ? 'text-white' : 'text-[#212282]'
                        }`}>
                          <span>1 Combo</span>
                          <span className={step >= 2 ? 'text-white/40' : 'text-gray-300'}>•</span>
                          <span>1 Side</span>
                          {extrasCount > 0 && (
                            <>
                              <span className={step >= 2 ? 'text-white/40' : 'text-gray-300'}>•</span>
                              <span className="text-[#E6411C]">{extrasCount} Extra{extrasCount > 1 ? 's' : ''}</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className={`text-sm font-medium leading-relaxed truncate ${
                          step >= 2 ? 'text-white/80' : 'text-[#212282]'
                        }`}>
                          {getSummaryText()}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        step >= 2 ? 'text-white/60' : 'text-gray-500'
                      }`}>
                        Total
                      </p>
                      <p className={`text-xl font-extrabold tracking-tight ${
                        step >= 2 ? 'text-white' : 'text-[#212282]'
                      }`}>
                        {formatPrice(calculateTotal())}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={step < 4 ? () => setStep(step + 1) : handleAddToCart}
                    disabled={!canProceed()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl h-14 text-white text-lg font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#E6411C] hover:bg-[#d13a18]"
                  >
                    <span>{getNextButtonText()}</span>
                    {step < 4 && <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}