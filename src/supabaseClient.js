const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('./config');

const supabase = createClient(supabaseUrl, supabaseKey);

async function hasReplied(senderId) {
  const { data } = await supabase
    .from('replied_senders')
    .select('sender_id')
    .eq('sender_id', senderId)
    .single();
  return !!data;
}

async function markReplied(senderId) {
  await supabase
    .from('replied_senders')
    .insert({ sender_id: senderId });
}

module.exports = { hasReplied, markReplied };
