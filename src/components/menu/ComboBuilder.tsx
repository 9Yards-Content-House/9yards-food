import { useState, useEffect } from 'react';
import { X, Check, ChevronRight, ChevronLeft, Plus, Minus } from 'lucide-react';
import { menuData, MainDish, Sauce, Juice, Dessert, SideDish } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart, CartItem, SauceSelection, ExtraItem } from '@/context/CartContext';
import { toast } from 'sonner';

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
      // Prevent body scroll when modal is open
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
    toast.success('Combo added to cart!');
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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-t-3xl md:rounded-3xl shadow-elevated overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="combo-builder-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 id="combo-builder-title" className="text-xl font-bold text-foreground">Build Your Meal</h2>
                <p className="text-sm text-muted-foreground">
                  Step {step} of 4:{' '}
                  {step === 1 && 'Choose Your Food'}
                  {step === 2 && 'Choose Your Sauce'}
                  {step === 3 && 'Choose Your Side Dish'}
                  {step === 4 && 'Add Extras'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Close combo builder"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3 bg-muted/30">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      s <= step ? 'bg-secondary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <>
                {/* Step 1: Main Dishes */}
                {step === 1 && (
                  <div
                    className="space-y-4"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      Select one or more main dishes for your combo
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {menuData.mainDishes.map((dish) => (
                        <button
                          key={dish.id}
                          onClick={() => toggleMainDish(dish.id)}
                          disabled={!dish.available}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            selectedMainDishes.includes(dish.id)
                              ? 'border-secondary bg-secondary/10'
                              : 'border-border hover:border-secondary/50'
                          } ${!dish.available && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                          />
                          <span className="font-medium text-sm text-foreground">
                            {dish.name}
                          </span>
                          {selectedMainDishes.includes(dish.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-secondary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Sauce */}
                {step === 2 && (
                  <div
                    className="space-y-6"
                  >
                    <p className="text-sm text-muted-foreground">
                      Choose your sauce and customize it
                    </p>

                    {/* Sauce Selection */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {menuData.sauces.map((sauce) => (
                        <button
                          key={sauce.id}
                          onClick={() => {
                            setSelectedSauce(sauce);
                            setSaucePreparation('');
                            setSauceSize(null);
                          }}
                          disabled={!sauce.available}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            selectedSauce?.id === sauce.id
                              ? 'border-secondary bg-secondary/10'
                              : 'border-border hover:border-secondary/50'
                          } ${!sauce.available && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <img
                            src={sauce.image}
                            alt={sauce.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                          />
                          <span className="font-medium text-sm text-foreground block">
                            {sauce.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            from {formatPrice(sauce.basePrice)}
                          </span>
                          {selectedSauce?.id === sauce.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-secondary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Sauce Options */}
                    {selectedSauce && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        {/* Preparation */}
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Preparation Style
                          </label>
                          <div className="flex gap-2">
                            {selectedSauce.preparations.map((prep) => (
                              <button
                                key={prep}
                                onClick={() => setSaucePreparation(prep)}
                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                  saucePreparation === prep
                                    ? 'border-secondary bg-secondary text-secondary-foreground'
                                    : 'border-border hover:border-secondary/50 text-foreground'
                                }`}
                              >
                                {prep}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Size */}
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Size / Portion
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {selectedSauce.sizes.map((size) => (
                              <button
                                key={size.name}
                                onClick={() => setSauceSize(size)}
                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                  sauceSize?.name === size.name
                                    ? 'border-secondary bg-secondary text-secondary-foreground'
                                    : 'border-border hover:border-secondary/50 text-foreground'
                                }`}
                              >
                                {size.name} - {formatPrice(size.price)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Side Dish */}
                {step === 3 && (
                  <div
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="badge-free">FREE</span>
                      <p className="text-sm text-muted-foreground">
                        Choose your complimentary side dish
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {menuData.sideDishes.map((side) => (
                        <button
                          key={side.id}
                          onClick={() => setSelectedSideDish(side.id)}
                          disabled={!side.available}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            selectedSideDish === side.id
                              ? 'border-secondary bg-secondary/10'
                              : 'border-border hover:border-secondary/50'
                          } ${!side.available && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <img
                            src={side.image}
                            alt={side.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                          />
                          <span className="font-medium text-sm text-foreground">
                            {side.name}
                          </span>
                          {selectedSideDish === side.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-secondary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Extras */}
                {step === 4 && (
                  <div
                    className="space-y-6"
                  >
                    <p className="text-sm text-muted-foreground">
                      Add natural juices or desserts (optional)
                    </p>

                    {/* Juices */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        Natural Juices
                      </h4>
                      <div className="space-y-2">
                        {menuData.juices.map((juice) => {
                          const selected = selectedJuices.find((j) => j.id === juice.id);
                          return (
                            <div
                              key={juice.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={juice.image}
                                  alt={juice.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <span className="font-medium text-sm text-foreground">
                                    {juice.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground block">
                                    {formatPrice(juice.price)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateJuiceQuantity(juice.id, -1)}
                                  className="w-11 h-11 rounded-full bg-muted flex items-center justify-center hover:bg-secondary/20 transition-colors"
                                  aria-label={`Decrease ${juice.name} quantity`}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-medium" aria-label={`Quantity: ${selected?.quantity || 0}`}>
                                  {selected?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => updateJuiceQuantity(juice.id, 1)}
                                  className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                                  aria-label={`Increase ${juice.name} quantity`}
                                >
                                  <Plus className="w-4 h-4 text-secondary-foreground" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Desserts */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Desserts</h4>
                      <div className="space-y-2">
                        {menuData.desserts.map((dessert) => {
                          const selected = selectedDesserts.find((d) => d.id === dessert.id);
                          return (
                            <div
                              key={dessert.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={dessert.image}
                                  alt={dessert.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <span className="font-medium text-sm text-foreground">
                                    {dessert.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground block">
                                    {formatPrice(dessert.price)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateDessertQuantity(dessert.id, -1)}
                                  className="w-11 h-11 rounded-full bg-muted flex items-center justify-center hover:bg-secondary/20 transition-colors"
                                  aria-label={`Decrease ${dessert.name} quantity`}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-medium" aria-label={`Quantity: ${selected?.quantity || 0}`}>
                                  {selected?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => updateDessertQuantity(dessert.id, 1)}
                                  className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                                  aria-label={`Increase ${dessert.name} quantity`}
                                >
                                  <Plus className="w-4 h-4 text-secondary-foreground" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              {/* Price Summary */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(calculateTotal())}
                </span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 btn-outline flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={!canProceed()}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
