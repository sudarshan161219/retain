import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./index.module.css";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--label)"
          size={16}
        />
        <Input
          type="text"
          placeholder="Search clients..."
          className="pl-9 pr-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Select>
        <SelectTrigger className={styles.selectTrigger}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
