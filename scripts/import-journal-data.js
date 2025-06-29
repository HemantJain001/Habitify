const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function importJournalData() {
  try {
    // First, we need to find a user to associate the journal entries with
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.log('No user found. Please sign up first.')
      return
    }

    console.log(`Found user: ${user.email}`)

    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'dummy_data', 'journal_entries_60_days.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    
    // Parse CSV (skip header)
    const lines = csvContent.split('\n').slice(1).filter(line => line.trim())
    
    let imported = 0
    
    for (const line of lines) {
      const columns = line.split(',')
      
      if (columns.length >= 4) {
        const [date, mood, notes] = columns
        
        // Clean up the notes (remove quotes if present)
        const cleanNotes = notes.replace(/^"|"$/g, '')
        
        try {
          // Check if entry already exists for this date
          const existingEntry = await prisma.journalEntry.findFirst({
            where: {
              userId: user.id,
              date: {
                gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                lt: new Date(new Date(date).setHours(23, 59, 59, 999))
              }
            }
          })

          if (!existingEntry) {
            await prisma.journalEntry.create({
              data: {
                date: new Date(date),
                mood: parseInt(mood) || 5,
                notes: cleanNotes,
                userId: user.id
              }
            })
            imported++
            console.log(`Imported journal entry for ${date}`)
          } else {
            console.log(`Journal entry already exists for ${date}`)
          }
        } catch (error) {
          console.error(`Error importing entry for ${date}:`, error)
        }
      }
    }
    
    console.log(`Successfully imported ${imported} journal entries`)
    
  } catch (error) {
    console.error('Error importing journal data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
importJournalData()
