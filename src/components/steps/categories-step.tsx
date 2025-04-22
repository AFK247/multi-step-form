import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormData } from "@/components/multi-step-form";

const CATEGORIES = [
  { id: "technology", label: "Technology" },
  { id: "health", label: "Health" },
  { id: "finance", label: "Finance" },
  { id: "education", label: "Education" },
  { id: "entertainment", label: "Entertainment" },
  { id: "travel", label: "Travel" },
  { id: "food", label: "Food" },
  { id: "sports", label: "Sports" },
];

export default function CategoriesStep() {
  const { control } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          Select Categories
        </h2>
        <p className="text-slate-600 mt-1">
          Please select one or more categories that interest you.
        </p>
      </div>

      <FormField
        control={control}
        name="categories"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map((category) => (
                <FormField
                  key={category.id}
                  control={control}
                  name="categories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={category.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            className="cursor-pointer"
                            checked={field.value?.includes(category.id)}
                            onCheckedChange={(checked) => {
                              const updatedCategories = checked
                                ? [...(field.value || []), category.id]
                                : field.value?.filter(
                                    (value) => value !== category.id
                                  ) || [];

                              field.onChange(updatedCategories);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {category.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
