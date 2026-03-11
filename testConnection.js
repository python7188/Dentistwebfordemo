import 'dotenv/config'
import { supabase } from './lib/supabaseClient.js'

async function testConnection() {

    const { data, error } = await supabase
        .from('doctors')
        .select('*')

    if (error) {
        console.log("❌ Connection Error:", error)
    } else {
        console.log("✅ Supabase Connected Successfully")
        console.log(data)
    }

}

testConnection()