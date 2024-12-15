import { supabase } from "@/integrations/supabase/client";

interface AgentFormData {
  name: string;
  description: string;
  instructions: string | null;
  expertise: string;
  traits: string[];
}

export const updateAgent = async (agentId: string, formData: AgentFormData) => {
  const { error } = await supabase
    .from('agents')
    .update({
      name: formData.name,
      description: formData.description,
      instructions: formData.instructions || null,
      expertise: formData.expertise,
      traits: formData.traits,
      updated_at: new Date().toISOString(),
    })
    .eq('id', agentId);

  if (error) throw error;
  return true;
};

export const createAgent = async (formData: AgentFormData, userId: string) => {
  const { data: agent, error } = await supabase
    .from('agents')
    .insert({
      name: formData.name,
      description: formData.description,
      instructions: formData.instructions || null,
      expertise: formData.expertise,
      traits: formData.traits,
      creator_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return agent;
};