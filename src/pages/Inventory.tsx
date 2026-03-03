import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Medicine {
  id: number;
  name: string;
  batch: string;
  stock: number;
  price: number;
  expiry: string;
}

const statusStyles: Record<string, string> = {
  'In Stock': 'bg-secondary/10 text-secondary border-secondary/20',
  'Low Stock': 'bg-destructive/10 text-destructive border-destructive/20',
  'Out of Stock': 'bg-muted text-muted-foreground border-border',
};

export default function Inventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    batch: '',
    stock: '',
    price: '',
    expiry: ''
  });

  const { ref, isVisible } = useScrollAnimation();

  /* =============================
     🔥 CHANGE THIS IF PORT IS DIFFERENT
  ============================== */
  const API = "http://localhost:5000/api/medicines";
  // OR if using IP:
  // const API = "http://10.3.26.2:5000/api/medicines";

  /* =============================
     FETCH FROM DATABASE
  ============================== */
  const fetchMedicines = async () => {
    try {
      const res = await fetch(API);

      if (!res.ok) {
        throw new Error("Failed to fetch medicines");
      }

      const data = await res.json();
      setMedicines(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  /* =============================
     ADD MEDICINE
  ============================== */
  const handleAdd = async () => {
    if (!newMed.name || !newMed.batch) {
      alert("Please fill required fields");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMed.name,
          batch: newMed.batch,
          stock: Number(newMed.stock),
          price: Number(newMed.price),
          expiry: newMed.expiry
        })
      });

      if (!res.ok) {
        throw new Error("Failed to add medicine");
      }

      setNewMed({ name: '', batch: '', stock: '', price: '', expiry: '' });
      setShowAdd(false);
      fetchMedicines();

    } catch (error) {
      console.error("Add error:", error);
    }
  };

  /* =============================
     DELETE MEDICINE
  ============================== */
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      fetchMedicines();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* =============================
     UPDATE STOCK
  ============================== */
  const handleEdit = async (id: number, currentStock: number) => {
    const newStock = prompt("Enter new stock quantity:", currentStock.toString());
    if (!newStock) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Number(newStock) })
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      fetchMedicines();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.batch.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 50) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your medicine stock
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="gradient-primary text-primary-foreground border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search medicines or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div
        ref={ref}
        className={`overflow-hidden rounded-2xl border border-border bg-card ${
          isVisible ? 'animate-slide-up' : 'opacity-0'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Medicine</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Expiry</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((med) => {
                const status = getStatus(med.stock);
                return (
                  <tr key={med.id} className="border-b border-border hover:bg-accent/30">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span>{med.name}</span>
                    </td>
                    <td className="px-6 py-4">{med.batch}</td>
                    <td className="px-6 py-4">{med.stock}</td>
                    <td className="px-6 py-4">${Number(med.price).toFixed(2)}</td>
                    <td className="px-6 py-4">{med.expiry?.split("T")[0]}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={statusStyles[status]}>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(med.id, med.stock)}>
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(med.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <Input
              placeholder="Batch"
              value={newMed.batch}
              onChange={(e) => setNewMed({ ...newMed, batch: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newMed.stock}
              onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newMed.price}
              onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
            />
            <Input
              type="date"
              value={newMed.expiry}
              onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })}
            />
            <Button
              onClick={handleAdd}
              className="w-full gradient-primary text-primary-foreground border-0"
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}