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
  const [showEdit, setShowEdit] = useState(false);
  const [editMed, setEditMed] = useState<Medicine | null>(null);

  const [newMed, setNewMed] = useState({
    name: '',
    batch: '',
    stock: '',
    price: '',
    expiry: ''
  });

  const { ref, isVisible } = useScrollAnimation();

  const API = "http://localhost:3000/api/medicines";

  /* =============================
     FETCH MEDICINES
  ============================== */
  const fetchMedicines = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMedicines(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  /* =============================
     ADD MEDICINE
  ============================== */
  const handleAdd = async () => {
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

      if (!res.ok) throw new Error("Add failed");

      setShowAdd(false);
      setNewMed({ name: '', batch: '', stock: '', price: '', expiry: '' });
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  /* =============================
     DELETE
  ============================== */
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  /* =============================
     OPEN EDIT MODAL
  ============================== */
  const handleEditClick = (med: Medicine) => {
    setEditMed(med);
    setShowEdit(true);
  };

  /* =============================
     UPDATE MEDICINE
  ============================== */
  const handleUpdate = async () => {
    if (!editMed) return;

    try {
      await fetch(`${API}/${editMed.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMed)
      });

      setShowEdit(false);
      fetchMedicines();
    } catch (err) {
      console.error(err);
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage your medicine stock</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
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
      <div ref={ref} className={`overflow-hidden rounded-xl border bg-card ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left">Medicine</th>
              <th className="p-4 text-left">Batch</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Expiry</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((med) => {
              const status = getStatus(med.stock);
              return (
                <tr key={med.id} className="border-b hover:bg-accent/30">
                  <td className="p-4 flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    {med.name}
                  </td>
                  <td className="p-4">{med.batch}</td>
                  <td className="p-4">{med.stock}</td>
                  <td className="p-4">${Number(med.price).toFixed(2)}</td>
                  <td className="p-4">{med.expiry?.split("T")[0]}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={statusStyles[status]}>
                      {status}
                    </Badge>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEditClick(med)}>
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

      {/* Add Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Name" value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} />
            <Input placeholder="Batch" value={newMed.batch} onChange={(e) => setNewMed({ ...newMed, batch: e.target.value })} />
            <Input type="number" placeholder="Stock" value={newMed.stock} onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })} />
            <Input type="number" placeholder="Price" value={newMed.price} onChange={(e) => setNewMed({ ...newMed, price: e.target.value })} />
            <Input type="date" value={newMed.expiry} onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })} />
            <Button onClick={handleAdd} className="w-full">Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>

          {editMed && (
            <div className="space-y-4">
              <Input value={editMed.name} onChange={(e) => setEditMed({ ...editMed, name: e.target.value })} />
              <Input value={editMed.batch} onChange={(e) => setEditMed({ ...editMed, batch: e.target.value })} />
              <Input type="number" value={editMed.stock} onChange={(e) => setEditMed({ ...editMed, stock: Number(e.target.value) })} />
              <Input type="number" value={editMed.price} onChange={(e) => setEditMed({ ...editMed, price: Number(e.target.value) })} />
              <Input type="date" value={editMed.expiry?.split("T")[0]} onChange={(e) => setEditMed({ ...editMed, expiry: e.target.value })} />
              <Button onClick={handleUpdate} className="w-full">Update</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}