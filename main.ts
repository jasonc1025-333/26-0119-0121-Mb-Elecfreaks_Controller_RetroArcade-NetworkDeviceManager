/**
 * ============================================================================
 * RQ100 NETWORK DEVICE MANAGER (NDM) - ARCADE VERSION
 * ============================================================================
 * 
 * Converted from micro:bit LED display to Elecfreaks Retro Arcade controller
 * with multi-page interface and scrolling display.
 * 
 * PHASE 1: Core Live Monitor (Page 1)
 * 
 * PAGES:
 * - Page 1 (currentPage=0): Live Device Monitor (auto-sorted by update recency)
 * - Page 2 (currentPage=1): Detailed Bot View (future)
 * - Page 3 (currentPage=2): Settings/Status (future)
 * 
 * FEATURES:
 * - Receives radio messages from up to 50 bots
 * - Displays bot data on color screen with scrolling
 * - Outputs to serial (raw mode) for Raspberry Pi hub
 * - Auto-sorts bots by most recent update
 * - Tracks update cycles and age
 * - Color-coded status indicators
 * 
 * VERSION: v0.3.0-Phase1
 * DATE: 26-0120-1300
 * ============================================================================
 */

/**
 * ============================================================================
 * GLOBAL VARIABLES
 * ============================================================================
 */

// Page Navigation
let currentPage = 0
let TOTAL_PAGES = 3

// Scoreboard/NDM Data Structures
let scoreboard_BotsAll_ArrayListOfText_2D: string[][] = []
let scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D: string[] = []
let scoreboard_ColumnBackend_FieldNames_ArrayListOfText: string[] = []
let scoreboard_ColumnFrontend_TitleNames_ArrayListOfText: string[] = []

// Network Data
let network_DataPacket_Rcvd_FieldNames_ArrayListOfText: string[] = []
let network_DataPacket_Rcvd_Str = ""
let network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList: string[] = []
let network_DataPacket_Rcvd_MessageHeader_Key_AsBotId_Str = ""
let network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str = ""

// Network Configuration
let network_GroupChannel_MyBotAndController_Base0_Int = 0
let network_GroupChannel_ScoreboardServer_BASE0_INT = 0

// Cycle Tracking (NEW for Arcade version)
let cycle_Current_Int = 0

// Scoreboard Control
let scoreboard_Bot_Found_Bool = false
let scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = false
let scoreboard_Server_SerialPrint_RawScores_Bool = false

// Display Scrolling (for Page 1)
let scrollOffset = 0
let isScrollPaused = 0
let MAX_CONSOLE_LINES = 7  // Number of bot rows visible on screen
let LINE_HEIGHT = 12

// Debug Flags
let _debug_Show_Priority_Hi_Bool = false
let _debug_Show_Priority_Lo_Bool = false

// System Variables
let _codeComment_AsText = ""

// Temporary variables for parsing
let keyvaluepair_key = ""
let keyvaluepair_value = ""

/**
 * ============================================================================
 * SETUP FUNCTIONS
 * ============================================================================
 */

function setup_BotAndController_Fn() {
    _codeComment_AsText = "Network Data Packet Field Names"

    network_DataPacket_Rcvd_FieldNames_ArrayListOfText = [
        "ID#",
        "CH#",
        "S1L",
        "S0R",
        "S3L",
        "S2R",
        "S7L",
        "S6R"
    ]

    scoreboard_ColumnFrontend_TitleNames_ArrayListOfText = [
        "Id",
        "Ch",
        "WL",
        "WR",
        "W2L",
        "W2R",
        "AL",
        "AR",
        "Age"
    ]

    scoreboard_ColumnBackend_FieldNames_ArrayListOfText = [
        "?",
        "?",
        "S1L",
        "S0R",
        "S3L",
        "S2R",
        "S7L",
        "S6R",
        "0"  // Age/cycle placeholder
    ]

    scoreboard_BotsAll_ArrayListOfText_2D = []
}

function setup_Network_Fn() {
    radio.setGroup(network_GroupChannel_MyBotAndController_Base0_Int)
    //// jwc 26-0120-1400 not available for Arcade: serial.redirectToUSB()
}

/**
 * ============================================================================
 * PAGE RENDERING FUNCTIONS
 * ============================================================================
 */

/**
 * Page 1 (currentPage=0): Live Device Monitor with auto-sorted bot list
 */
function renderPage1_LiveMonitor() {
    // Clear screen
    scene.setBackgroundColor(15)  // Dark background
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)

    // Title bar
    let title = textsprite.create("NETWORK DEVICE MANAGER", 0, 1)
    title.setPosition(80, 8)

    let pageNum = textsprite.create("[1/3]", 0, 5)
    pageNum.setPosition(145, 8)

    // Column headers (abbreviated to fit)
    let yPos = 20
    let headerText = "Id  Ch WL WR W2L W2R AL AR Age"
    let header = textsprite.create(headerText, 0, 7)  // Green
    header.setPosition(80, yPos)

    // Sort bots by most recent update (highest cycle_LastUpdate_Int first)
    sortBotsByUpdateRecency()

    // Calculate visible range based on scroll offset
    yPos = 32
    let visibleBots = scoreboard_BotsAll_ArrayListOfText_2D.slice(
        scrollOffset,
        scrollOffset + MAX_CONSOLE_LINES
    )

    // Display bot rows
    for (let bot of visibleBots) {
        // Calculate age
        let age = cycle_Current_Int - parseFloat(bot[8])

        // Format: "abc01 001 50 50 51 52 56 57  2"
        let botLine = "" + bot[0] + " " + bot[1] + " " +
            bot[2] + " " + bot[3] + " " +
            bot[4] + " " + bot[5] + " " +
            bot[6] + " " + bot[7] + " " + age

        // Color based on age
        let color = 5  // Yellow (default - active)
        if (age > 10) {
            color = 1  // Gray (stale)
        }

        let botText = textsprite.create(botLine, 0, color)
        botText.setPosition(80, yPos)
        yPos += LINE_HEIGHT
    }

    // Navigation instructions
    let navText = ""
    if (isScrollPaused == 1) {
        navText = "Up/Dn:Scroll Right:Resume"
    } else {
        navText = "Up/Dn:Pause A:Next"
    }
    let nav = textsprite.create(navText, 0, 7)
    nav.setPosition(80, 112)
}

/**
 * Page 2 (currentPage=1): Detailed Bot View (placeholder)
 */
function renderPage2_DetailedView() {
    scene.setBackgroundColor(7)  // Green background
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)

    let title = textsprite.create("DETAILED BOT VIEW", 0, 1)
    title.setPosition(80, 10)

    let pageNum = textsprite.create("[2/3]", 0, 5)
    pageNum.setPosition(145, 10)

    let info = textsprite.create("Coming Soon!", 0, 15)
    info.setPosition(80, 60)

    let nav = textsprite.create("A:Next B:Back", 0, 7)
    nav.setPosition(80, 112)
}

/**
 * Page 3 (currentPage=2): Settings/Status (placeholder)
 */
function renderPage3_Settings() {
    scene.setBackgroundColor(8)  // Blue background
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)

    let title = textsprite.create("SETTINGS/STATUS", 0, 1)
    title.setPosition(80, 10)

    let pageNum = textsprite.create("[3/3]", 0, 5)
    pageNum.setPosition(145, 10)

    // Display basic settings
    let yPos = 30

    let ch = textsprite.create("Network Ch: " + network_GroupChannel_MyBotAndController_Base0_Int, 0, 15)
    ch.setPosition(80, yPos)
    yPos += 15

    let botCount = textsprite.create("Bots: " + scoreboard_BotsAll_ArrayListOfText_2D.length, 0, 15)
    botCount.setPosition(80, yPos)
    yPos += 15

    let freeze = scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool ? "FROZEN" : "Active"
    let freezeColor = scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool ? 2 : 4  // Red or Green
    let freezeText = textsprite.create("Status: " + freeze, 0, freezeColor)
    freezeText.setPosition(80, yPos)

    let nav = textsprite.create("A:Next B:Back", 0, 7)
    nav.setPosition(80, 112)
}

/**
 * Switch to specified page
 */
function switchToPage(pageNum: number) {
    currentPage = pageNum

    if (currentPage == 0) {
        renderPage1_LiveMonitor()
    } else if (currentPage == 1) {
        renderPage2_DetailedView()
    } else if (currentPage == 2) {
        renderPage3_Settings()
    }
}

/**
 * ============================================================================
 * DATA PROCESSING FUNCTIONS
 * ============================================================================
 */

/**
 * Sort bots by most recent update (descending cycle_LastUpdate_Int)
 */
function sortBotsByUpdateRecency() {
    // Simple bubble sort (sufficient for up to 50 bots)
    for (let i = 0; i < scoreboard_BotsAll_ArrayListOfText_2D.length - 1; i++) {
        for (let j = 0; j < scoreboard_BotsAll_ArrayListOfText_2D.length - i - 1; j++) {
            let cycle1 = parseFloat(scoreboard_BotsAll_ArrayListOfText_2D[j][8])
            let cycle2 = parseFloat(scoreboard_BotsAll_ArrayListOfText_2D[j + 1][8])

            // Sort descending (most recent first)
            if (cycle1 < cycle2) {
                let temp = scoreboard_BotsAll_ArrayListOfText_2D[j]
                scoreboard_BotsAll_ArrayListOfText_2D[j] = scoreboard_BotsAll_ArrayListOfText_2D[j + 1]
                scoreboard_BotsAll_ArrayListOfText_2D[j + 1] = temp
            }
        }
    }
}

/**
 * Process received radio message
 */
function network_Rx_Processing_Func(receivedString: string) {
    if (!(scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool)) {
        network_DataPacket_Rcvd_Str = receivedString

        if (_debug_Show_Priority_Lo_Bool) {
            serial.writeString("* A: Raw String: ")
            serial.writeLine("\"" + network_DataPacket_Rcvd_Str + "\"")
        }

        // Parse message into key-value pairs
        network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList = network_DataPacket_Rcvd_Str.split(",")
        network_DataPacket_Rcvd_MessageHeader_Key_AsBotId_Str = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].substr(0, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].indexOf(":"))
        // Blank last argument (<< NOT SEEM TO WORK) -or- Use current string_length (which is more than enough) to insure read to 'end_of_string'
        network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].substr(network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].indexOf(":") + 1, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].length)

        // Check if bot already exists
        scoreboard_Bot_Found_Bool = false
        for (let scoreboard_botsingle_arraylistoftext_1d of scoreboard_BotsAll_ArrayListOfText_2D) {
            // Hardcode 'Index = 0' to access actual 'BotId'
            // Compare w Key(SerialId) vs Value(GroupCh#) for True BotId
            if (scoreboard_botsingle_arraylistoftext_1d[0] == network_DataPacket_Rcvd_MessageHeader_Key_AsBotId_Str) {
                // If Existing, Then Update Row
                scoreboard_Bot_Found_Bool = true
                scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D = scoreboard_botsingle_arraylistoftext_1d
                doScoreboard_BotSingle_ArrayListOfText_Fill_Fn()

                // Update cycle timestamp
                scoreboard_botsingle_arraylistoftext_1d[8] = "" + cycle_Current_Int

                if (_debug_Show_Priority_Hi_Bool) {
                    serial.writeString("* C1>")
                    for (let scoreboard_botsingle_columndata_1d of scoreboard_botsingle_arraylistoftext_1d) {
                        serial.writeString("" + scoreboard_botsingle_columndata_1d + "|")
                    }
                    serial.writeLine("* C1<")
                }
                break
            }
        }

        // If new bot, create entry
        if (!(scoreboard_Bot_Found_Bool)) {
            // If Not Existing, Then Create New Row
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D = []

            // 9 Slots (8 data fields + 1 cycle timestamp)
            for (let index = 0; index < 9; index++) {
                scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D.push("")
            }

            // Write in the Header Components
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[0] = network_DataPacket_Rcvd_MessageHeader_Key_AsBotId_Str
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[1] = network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[8] = "" + cycle_Current_Int  // cycle_LastUpdate_Int

            doScoreboard_BotSingle_ArrayListOfText_Fill_Fn()

            if (_debug_Show_Priority_Hi_Bool) {
                serial.writeString("* D1>")
                for (let scoreboard_botsingle_columndata_1d of scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D) {
                    serial.writeString("" + scoreboard_botsingle_columndata_1d + "|")
                }
                serial.writeLine("* D1<")
            }

            scoreboard_BotsAll_ArrayListOfText_2D.push(scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D)
        }

        // Output to serial if enabled
        if (scoreboard_Server_SerialPrint_RawScores_Bool) {
            // * E: Forward to Server on Raspberry Pi
            serial.writeLine(network_DataPacket_Rcvd_Str)
        }
    }
}

/**
 * Fill bot data from parsed key-value pairs
 */
function doScoreboard_BotSingle_ArrayListOfText_Fill_Fn() {
    for (let network_datapacket_rcvd_a_keyvaluepair of network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList) {
        keyvaluepair_key = network_datapacket_rcvd_a_keyvaluepair.substr(0, network_datapacket_rcvd_a_keyvaluepair.indexOf(":"))
        // Blank last argument (<< NOT SEEM TO WORK) -or- Use current string_length (which is more than enough) to insure read to 'end_of_string'
        keyvaluepair_value = network_datapacket_rcvd_a_keyvaluepair.substr(network_datapacket_rcvd_a_keyvaluepair.indexOf(":") + 1, network_datapacket_rcvd_a_keyvaluepair.length)

        // Write in the Body Components
        if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[2]) {
            // 2:S1L
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[2] = keyvaluepair_value
        } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[3]) {
            // 3:S0R
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[3] = keyvaluepair_value
        } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[4]) {
            // 4:S3L
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[4] = keyvaluepair_value
        } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[5]) {
            // 5:S2R
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[5] = keyvaluepair_value
        } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[6]) {
            // 6:S7L
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[6] = keyvaluepair_value
        } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[7]) {
            // 7:S6R
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[7] = keyvaluepair_value
        }
    }
}

/**
 * ============================================================================
 * BUTTON CONTROLS
 * ============================================================================
 */

// A Button: Next page
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let nextPage = (currentPage + 1) % TOTAL_PAGES
    switchToPage(nextPage)
})

// B Button: Previous page
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    let prevPage = (currentPage - 1 + TOTAL_PAGES) % TOTAL_PAGES
    switchToPage(prevPage)
})

// Up Button: Scroll up on live monitor page
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0) {
        isScrollPaused = 1
        scrollOffset = Math.max(0, scrollOffset - 1)
        renderPage1_LiveMonitor()
    }
})

// Down Button: Scroll down on live monitor page
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0) {
        isScrollPaused = 1
        let maxOffset = Math.max(0, scoreboard_BotsAll_ArrayListOfText_2D.length - MAX_CONSOLE_LINES)
        scrollOffset = Math.min(maxOffset, scrollOffset + 1)
        renderPage1_LiveMonitor()
    }
})

// Right Button: Resume auto-scrolling
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0 && isScrollPaused == 1) {
        isScrollPaused = 0
        scrollOffset = Math.max(0, scoreboard_BotsAll_ArrayListOfText_2D.length - MAX_CONSOLE_LINES)
        renderPage1_LiveMonitor()
    }
})

// Menu Button: Freeze/Unfreeze scoreboard
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = !scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool
    game.splash(scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool ? "FROZEN" : "ACTIVE")
    switchToPage(currentPage)  // Refresh current page
})

/**
 * ============================================================================
 * RADIO RECEIVER
 * ============================================================================
 */

// To Insure Both at Synchronized States, Both Bot and Controller Must Start/Re-Start at 'setup_and_startup' State
// * Important News
// ** 'receivedstring': 18 char max
// ** 'name': 8 char max for this project
radio.onReceivedString(function (receivedString) {
    network_Rx_Processing_Func(receivedString)

    // Auto-refresh page 1 if visible and not paused
    if (currentPage == 0 && isScrollPaused == 0) {
        renderPage1_LiveMonitor()
    }
})

/**
 * ============================================================================
 * PERIODIC UPDATES
 * ============================================================================
 */

// Increment global cycle counter every 100ms
game.onUpdateInterval(100, function () {
    cycle_Current_Int += 1
})

// Refresh display every 500ms if on page 1 and not paused
game.onUpdateInterval(500, function () {
    if (currentPage == 0 && isScrollPaused == 0) {
        renderPage1_LiveMonitor()
    }
})

/**
 * ============================================================================
 * MAIN PROGRAM START
 * ============================================================================
 */

// Show welcome splash
game.splash("RQ100 NDM", "Network Device Manager")
game.splash("Use A/B to navigate", "Menu to freeze")

// Initialize
// 'S' = 'S'erver
// ScoreBoard_Server
// Constant Channel # for Master Server, which Receives Everyone's Score. Use 255 vs 0, since 0 could be easily not used by normal users
network_GroupChannel_ScoreboardServer_BASE0_INT = 255
// * Good Stress Test: 199 (to test all dots for 10's, 1's; 255 (to test all dots for 100's: 1,2)
network_GroupChannel_MyBotAndController_Base0_Int = network_GroupChannel_ScoreboardServer_BASE0_INT

setup_BotAndController_Fn()
setup_Network_Fn()

// Set initial modes
scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = false
scoreboard_Server_SerialPrint_RawScores_Bool = true
// 'Debug On' for Testing
_debug_Show_Priority_Hi_Bool = true
_debug_Show_Priority_Lo_Bool = false

// Start on page 1 (Live Monitor)
switchToPage(0)

