'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MainNavbar } from '@/components/layout/main-navbar';

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  reason: string;
}

export default function ManualEntryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<number | '' >('');
  const [reason, setReason] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddTransaction = (type: 'income' | 'expense') => {
    if (amount && reason) {
      const newTransaction: Transaction = {
        type,
        amount: type === 'income' ? Number(amount) : -Number(amount),
        reason,
      };
      setTransactions([...transactions, newTransaction]);
      setAmount('');
      setReason('');
    }
  };

  const handleDeleteTransaction = (indexToDelete: number) => {
    setTransactions(transactions.filter((_, index) => index !== indexToDelete));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // This is a simulation of a file upload
      console.log('Uploading file:', selectedFile.name);
      alert(`Dosya "${selectedFile.name}" yüklendi (simülasyon).`);
      setSelectedFile(null);
    }
     else {
      alert('Lütfen bir dosya seçin.');
    }
  };


  return (
    <>
      <MainNavbar />
      <div className="container mx-auto mt-10">

        {/* File Upload Section */}
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Dosya Yükle</h2>
          <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <p className="text-sm text-muted-foreground">
              Finansal dökümanlarınızı (örneğin, banka ekstresi, faturalar) yükleyerek işlemleri otomatik olarak ekleyin.
            </p>
            <Input
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer bg-background file:cursor-pointer"
                />
            <Button onClick={handleFileUpload} disabled={!selectedFile}>
              Dosyayı Yükle ve İşle
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left Column: Entry Forms */}
          <div className="space-y-12">

            {/* Manual Data Entry Form */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Manuel Veri Girişi</h2>
              <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <Input
                  type="number"
                  placeholder="Miktar"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-background"
                />
                <Select onValueChange={setReason} value={reason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Giriş/Çıkış Sebebi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maaş">Maaş</SelectItem>
                    <SelectItem value="Kira">Kira</SelectItem>
                    <SelectItem value="Fatura">Fatura</SelectItem>
                    <SelectItem value="Market">Market</SelectItem>
                    <SelectItem value="Diğer">Diğer</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-4">
                  <Button onClick={() => handleAddTransaction('income')}>
                    Para Girişi Ekle
                  </Button>
                  <Button
                    onClick={() => handleAddTransaction('expense')}
                    variant="destructive"
                  >
                    Para Çıkışı Ekle
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transaction List */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Girilen Veriler</h2>
            <div className="space-y-3 rounded-lg border bg-card p-6 text-card-foreground shadow-sm min-h-[400px]">
              {transactions.length === 0 ? (
                <p className="pt-16 text-center text-muted-foreground">Henüz bir işlem girilmedi.</p>
              ) : (
                transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-md p-3 ${
                      transaction.type === 'income'
                        ? 'bg-green-900/20 text-green-300'
                        : 'bg-red-900/20 text-red-300'
                    }`}>
                    <span className="font-medium">{transaction.reason}</span>
                    <div className="flex items-center space-x-2">
                        <span
                        className={`font-semibold ${
                        transaction.type === 'income'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                        {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTransaction(index)}
                        >
                            Sil
                        </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
