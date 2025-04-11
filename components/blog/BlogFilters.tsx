"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function BlogFilters({ onFilterChange }) {
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("users").select("id, email");
      if (data) setAuthors(data);
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    onFilterChange({ search, author: selectedAuthor });
  }, [search, selectedAuthor, onFilterChange]);

  return (
    <div className="mb-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div>
        <label className="text-sm text-muted-foreground">Başlığa Göre Ara</label>
        <Input
          placeholder="Örn: Productivity"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-muted-foreground">Yazara Göre Filtrele</label>
        <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
          <SelectTrigger>
            <SelectValue placeholder="Yazar seçin" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setSearch("");
            setSelectedAuthor("");
            onFilterChange({ search: "", author: "" });
          }}
        >
          Filtreleri Sıfırla
        </Button>
      </div>
    </div>
  );
}