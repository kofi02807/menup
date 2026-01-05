import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const useRestaurant = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching restaurant:", error);
      }

      setRestaurant(data);
      setLoading(false);
    };

    fetchRestaurant();
  }, []);

  return { restaurant, loading };
};
