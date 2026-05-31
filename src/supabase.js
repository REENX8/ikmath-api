const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('./config');

module.exports = createClient(supabaseUrl, supabaseKey);
