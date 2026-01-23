// Sort bots by most recent update (descending cycle_LastUpdate_Int)
function sortBotsByUpdateRecency () {
    // Simple bubble sort (sufficient for up to 50 bots)
    for (let i = 0; i <= scoreboard_BotsAll_ArrayListOfText_2D.length - 1 - 1; i++) {
        for (let j = 0; j <= scoreboard_BotsAll_ArrayListOfText_2D.length - i - 1 - 1; j++) {
            cycle1 = parseFloat(scoreboard_BotsAll_ArrayListOfText_2D[j][8])
            cycle2 = parseFloat(scoreboard_BotsAll_ArrayListOfText_2D[j + 1][8])
            // Sort descending (most recent first)
            if (cycle1 < cycle2) {
                temp = scoreboard_BotsAll_ArrayListOfText_2D[j]
                scoreboard_BotsAll_ArrayListOfText_2D[j] = scoreboard_BotsAll_ArrayListOfText_2D[j + 1]
                scoreboard_BotsAll_ArrayListOfText_2D[j + 1] = temp
            }
        }
    }
}
// Up Button: Scroll up on live monitor page OR select bot on Page 1 OR select parameter on config page
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0) {
        if (page1_selectedBotIndex >= 0) {
            // Bot selection mode - move selection up
            page1_selectedBotIndex = Math.max(0, page1_selectedBotIndex - 1)
            renderPage1_LiveMonitor()
        } else {
            // Scroll mode
            isScrollPaused = 1
            scrollOffset = Math.max(0, scrollOffset - 1)
            renderPage1_LiveMonitor()
        }
    } else if (currentPage >= 3) {
        // CHANGE 1: Config page - move parameter selection up
        selectedParamIndex = Math.max(0, selectedParamIndex - 1)
        renderBotConfigPage()
    }
})
// Navigation instructions
function renderPage1_LiveMonitor () {
    // Clear screen
    // Dark background
    scene.setBackgroundColor(15)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    // Title bar
    title = textsprite.create("NETWORK DEVICE MANAGER", 0, 1)
    // // jwc 26-0120-1540 title.setMaxFontHeight(6)  // Original=8px (default), Reduced to 6px
    // jwc: Original=8px (default), Reduced to 5px to fit screen
    title.setMaxFontHeight(5)
    title.setPosition(80, 8)
    pageNum = textsprite.create("[1/3]", 0, 5)
    // // jwc 26-0120-1540 pageNum.setMaxFontHeight(6)  // Original=8px (default), Reduced to 6px
    // jwc: Original=8px (default), Reduced to 5px
    pageNum.setMaxFontHeight(5)
    pageNum.setPosition(145, 8)
    // Column headers (abbreviated to fit) - W2L/W2R moved to Page 2
    yPos = 20
    
    // jwc 26-0123-1200: Add up arrow if there's content above visible area
    if (scrollOffset > 0) {
        let upArrow = textsprite.create("^", 0, 7)  // Green arrow
        upArrow.setMaxFontHeight(8)
        upArrow.setPosition(80, yPos)  // Center position
    }
    
    // // jwc 26-0120-1540 o headerText = "Id    Ch  WL  WR  W2L W2R AL  AR  Age"
    headerText = "Id    Ch  WL  WR  AL  AR  Age"
    // Green
    header = textsprite.create(headerText, 0, 7)
    // // jwc 26-0120-1540 o header.setMaxFontHeight(6)  // Attempt 6px
    // // jwc 26-0120-1540 o header.setMaxFontHeight(5)  // Attempt 5px
    // // jwc 26-0120-1540 o header.setFont(image.font5)  // setFont() not supported
    // jwc: Arcade minimum font size is 8px (values <8 ignored)
    header.setMaxFontHeight(8)
    // // jwc 26-0120-1620 o header.setPosition(80, yPos)
    // // jwc 26-0120-1640 o header.setPosition(2, yPos)  // 2px left margin
    // // jwc: 82px from left (80+2), 85
    header.setPosition(90, yPos)
    // Sort bots by most recent update (highest cycle_LastUpdate_Int first)
    sortBotsByUpdateRecency()
    // Calculate visible range based on scroll offset
    yPos = 32
    let visibleBots = scoreboard_BotsAll_ArrayListOfText_2D.slice(
        scrollOffset,
        scrollOffset + MAX_CONSOLE_LINES
    )
// Display bot rows with selection cursor
    let botIndex = 0
    for (let bot of visibleBots) {
        // Calculate age
        age = cycle_Current_Int - parseFloat(bot[8])
        // Format with fixed-width columns for alignment - W2L/W2R removed (moved to Page 2)
        // // jwc 26-0120-1540 o Column widths: Id(5) Ch(3) WL(3) WR(3) W2L(3) W2R(3) AL(3) AR(3) Age(3)
        // Column widths: Id(5) Ch(3) WL(3) WR(3) AL(3) AR(3) Age(3)
        botLine = "" + padField(bot[0], 5) + " " + padField(bot[1], 3) + " " + padField(bot[2], 3) + " " + padField(bot[3], 3) + " " + padField(bot[6], 3) + " " + padField(bot[7], 3) + " " + padField("" + age, 3)
        
        // Add selection cursor if this bot is selected
        let actualBotIndex = scrollOffset + botIndex
        if (page1_selectedBotIndex >= 0 && actualBotIndex == page1_selectedBotIndex) {
            botLine = ">" + botLine
        } else {
            botLine = " " + botLine
        }
        
        // Color based on age
        // Yellow (default - active)
        color = 5
        if (age > 10) {
            // Gray (stale)
            color = 1
        }
        // Highlight selected bot with cyan
        if (page1_selectedBotIndex >= 0 && actualBotIndex == page1_selectedBotIndex) {
            color = 8  // Cyan for selected
        }
        
        botText = textsprite.create(botLine, 0, color)
        // // jwc 26-0120-1540 o botText.setMaxFontHeight(6)  // Attempt 6px
        // // jwc 26-0120-1540 o botText.setMaxFontHeight(5)  // Attempt 5px
        // // jwc 26-0120-1540 o botText.setFont(image.font5)  // setFont() not supported
        // jwc: Arcade minimum font size is 8px (values <8 ignored)
        botText.setMaxFontHeight(8)
        // // jwc 26-0120-1620 o botText.setPosition(80, yPos)
        // // jwc 26-0120-1640 o botText.setPosition(2, yPos)  // 2px left margin
        // // jwc: 82px from left (80+2), 85
        botText.setPosition(90, yPos)
        yPos += LINE_HEIGHT
        botIndex++
    }
    // jwc 26-0123-1200: Add down arrow if there's content below visible area
    let maxScrollOffset = Math.max(0, scoreboard_BotsAll_ArrayListOfText_2D.length - MAX_CONSOLE_LINES)
    if (scrollOffset < maxScrollOffset) {
        let downArrow = textsprite.create("v", 0, 7)  // Green arrow
        downArrow.setMaxFontHeight(8)
        downArrow.setPosition(80, yPos)  // Below last bot line
    }
    
    // Update navigation text based on mode
    if (page1_selectedBotIndex >= 0) {
        navText = "Up/Dn:Select A:Config B:Exit"
    } else if (isScrollPaused == 1) {
        navText = "Up/Dn:Scroll Left:Select Right:Resume"
    } else {
        navText = "Up/Dn:Pause Left:Select A:Next"
    }
    nav = textsprite.create(navText, 0, 7)
    nav.setMaxFontHeight(5)
    nav.setPosition(80, 112)
}
// B Button: Exit selection mode OR Previous page OR return to Page 1 from config page
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0 && page1_selectedBotIndex >= 0) {
        // Exit selection mode on Page 1
        page1_selectedBotIndex = -1
        renderPage1_LiveMonitor()
    } else if (currentPage >= 3) {
        // CHANGE 5: Config page - return to Page 1 (Live Monitor)
        // Reset parameter selection
        selectedParamIndex = 0
        switchToPage(0)
    } else {
        // Normal page navigation
        prevPage = (currentPage - 1 + TOTAL_PAGES) % TOTAL_PAGES
        switchToPage(prevPage)
    }
})
// // jwc 26-0120-1400 not available for Arcade: serial.redirectToUSB()
function setup_Network_Fn () {
    radio.setGroup(network_GroupChannel_MyBotAndController_Base0_Int)
}
// A Button: Access config page if bot selected, send command on config page, otherwise next page
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0 && page1_selectedBotIndex >= 0) {
        // Jump to selected bot's config page (Page 3+)
        // Store bot ID for configuration
        configBotId = scoreboard_BotsAll_ArrayListOfText_2D[page1_selectedBotIndex][0]
        // Calculate config page number (Page 3 = first bot, Page 4 = second bot, etc.)
        let configPageNum = 3 + page1_selectedBotIndex
        switchToPage(configPageNum)
    } else if (currentPage >= 3) {
        // CHANGE 7: Config page - send selected parameter to bot
        let paramName = configParam_FieldNames_ArrayOfText[selectedParamIndex]
        let paramValue = configParam_Values_Now_ArrayOfNum[selectedParamIndex]
        sendConfigCommand("CFG", paramName, paramValue)
        
        // Show confirmation
        game.splash("Sent: " + paramName, "Value: " + paramValue)
        renderBotConfigPage()
    } else {
        // Normal page navigation
        nextPage = (currentPage + 1) % TOTAL_PAGES
        switchToPage(nextPage)
    }
})
// ============================================================================
// SETUP FUNCTIONS
// ============================================================================
function setup_BotAndController_Fn () {
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
    // Age/cycle placeholder
    scoreboard_ColumnBackend_FieldNames_ArrayListOfText = [
    "?",
    "?",
    "S1L",
    "S0R",
    "S3L",
    "S2R",
    "S7L",
    "S6R",
    "0"
    ]
    scoreboard_BotsAll_ArrayListOfText_2D = []
}
// Page 3 (currentPage=2): Settings/Status (placeholder)
function renderPage3_Settings () {
    // Blue background
    scene.setBackgroundColor(8)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    title3 = textsprite.create("SETTINGS/STATUS", 0, 1)
    title3.setPosition(80, 10)
    pageNum3 = textsprite.create("[3/3]", 0, 5)
    pageNum3.setPosition(145, 10)
    // Display basic settings
    yPos2 = 30
    ch = textsprite.create("Network Ch: " + network_GroupChannel_MyBotAndController_Base0_Int, 0, 15)
    ch.setPosition(80, yPos2)
    yPos2 += 15
    botCount = textsprite.create("Bots: " + scoreboard_BotsAll_ArrayListOfText_2D.length, 0, 15)
    botCount.setPosition(80, yPos2)
    yPos2 += 15
    let freeze = scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool ? "FROZEN" : "Active"
    let freezeColor = scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool ? 2 : 4
    freezeText = textsprite.create("Status: " + freeze, 0, freezeColor)
    freezeText.setPosition(80, yPos2)
    nav3 = textsprite.create("A:Next B:Back", 0, 7)
    nav3.setPosition(80, 112)
}
// Left Button: Enter/Exit bot selection mode on Page 1 OR decrease parameter value on config page
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0) {
        if (page1_selectedBotIndex >= 0) {
            // Exit selection mode
            page1_selectedBotIndex = -1
        } else {
            // Enter selection mode - select first bot
            if (scoreboard_BotsAll_ArrayListOfText_2D.length > 0) {
                page1_selectedBotIndex = 0
            }
        }
        renderPage1_LiveMonitor()
    } else if (currentPage >= 3) {
        // CHANGE 3: Config page - decrease selected parameter value
        let currentValue = configParam_Values_Now_ArrayOfNum[selectedParamIndex]
        let minValue = configParam_Values_Min_ArrayOfNum[selectedParamIndex]
        let newValue = Math.max(minValue, currentValue - 1)
        configParam_Values_Now_ArrayOfNum[selectedParamIndex] = newValue
        renderBotConfigPage()
    }
})
// Right Button: Resume auto-scrolling OR increase parameter value on config page
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0 && isScrollPaused == 1) {
        isScrollPaused = 0
        scrollOffset = Math.max(0, scoreboard_BotsAll_ArrayListOfText_2D.length - MAX_CONSOLE_LINES)
        renderPage1_LiveMonitor()
    } else if (currentPage >= 3) {
        // CHANGE 4: Config page - increase selected parameter value
        let currentValue = configParam_Values_Now_ArrayOfNum[selectedParamIndex]
        let maxValue = configParam_Values_Max_ArrayOfNum[selectedParamIndex]
        let newValue = Math.min(maxValue, currentValue + 1)
        configParam_Values_Now_ArrayOfNum[selectedParamIndex] = newValue
        renderBotConfigPage()
    }
})
// Process received radio message
function network_Rx_Processing_Func (receivedString: string) {
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
                break;
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
            // cycle_LastUpdate_Int
            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[8] = "" + cycle_Current_Int
            doScoreboard_BotSingle_ArrayListOfText_Fill_Fn()
            if (_debug_Show_Priority_Hi_Bool) {
                serial.writeString("* D1>")
for (let scoreboard_botsingle_columndata_1d2 of scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D) {
                    serial.writeString("" + scoreboard_botsingle_columndata_1d2 + "|")
                }
                serial.writeLine("* D1<")
            }
            scoreboard_BotsAll_ArrayListOfText_2D.push(scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D)
        }
        // Output to serial if enabled
        if (scoreboard_Server_SerialPrint_RawScores_Bool) {
            serial.writeLine(network_DataPacket_Rcvd_Str)
        }
    }
}
// Page 2 (currentPage=1): Detailed Bot View (placeholder)
function renderPage2_DetailedView () {
    // Green background
    scene.setBackgroundColor(7)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    title2 = textsprite.create("DETAILED BOT VIEW", 0, 1)
    title2.setPosition(80, 10)
    pageNum2 = textsprite.create("[2/3]", 0, 5)
    pageNum2.setPosition(145, 10)
    info2 = textsprite.create("Coming Soon!", 0, 15)
    info2.setPosition(80, 60)
    nav2 = textsprite.create("A:Next B:Back", 0, 7)
    nav2.setPosition(80, 112)
}
// Down Button: Scroll down on live monitor page OR select bot on Page 1 OR select parameter on config page
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentPage == 0) {
        if (page1_selectedBotIndex >= 0) {
            // Bot selection mode - move selection down
            let maxIndex = scoreboard_BotsAll_ArrayListOfText_2D.length - 1
            page1_selectedBotIndex = Math.min(maxIndex, page1_selectedBotIndex + 1)
            renderPage1_LiveMonitor()
        } else {
            // Scroll mode
            isScrollPaused = 1
            maxOffset = Math.max(0, scoreboard_BotsAll_ArrayListOfText_2D.length - MAX_CONSOLE_LINES)
            scrollOffset = Math.min(maxOffset, scrollOffset + 1)
            renderPage1_LiveMonitor()
        }
    } else if (currentPage >= 3) {
        // CHANGE 2: Config page - move parameter selection down
        let maxParamIndex = configParam_DisplayNames_ArrayOfText.length - 1
        selectedParamIndex = Math.min(maxParamIndex, selectedParamIndex + 1)
        renderBotConfigPage()
    }
})
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
// Logo Press: Toggle freeze/unfreeze scoreboard (removed - not supported in Arcade)
// Use controller.menu button instead if needed, or implement alternative
// Switch to specified page
function switchToPage (pageNum: number) {
    currentPage = pageNum
    if (currentPage == 0) {
        renderPage1_LiveMonitor()
    } else if (currentPage == 1) {
        renderPage2_DetailedView()
    } else if (currentPage == 2) {
        renderPage3_Settings()
    } else if (currentPage >= 3) {
        // Dynamic config pages (Page 3+ = bot config pages)
        renderBotConfigPage()
    }
}
// CHANGE 6: Add function to send configuration commands to bot with dynamic channel switching
// This function switches to bot's channel, sends command, then returns to NDM channel (255)
function sendConfigCommand(commandType: string, paramName: string, value: number) {
    // Get bot's channel from telemetry data (stored in column index 1)
    let botChannel = 1  // Default to channel 1
    if (page1_selectedBotIndex >= 0 && page1_selectedBotIndex < scoreboard_BotsAll_ArrayListOfText_2D.length) {
        let botChannelStr = scoreboard_BotsAll_ArrayListOfText_2D[page1_selectedBotIndex][1]
        if (botChannelStr != "" && botChannelStr != "-") {
            botChannel = parseFloat(botChannelStr)
        }
    }
    
    // NDM channel is always 255
    let network_GroupChannel_NetworkDeviceManager_Base0_Int = 255
    
    // Format command: "CFG:paramName=value" (bot expects this format)
    let command = commandType + ":" + paramName + "=" + value
    
    serial.writeLine("* NDM: Switching Ch 255 -> " + botChannel)
    
    // Set debug status for OLED display
    debugStatusText = "TX Ch" + botChannel + ":" + command
    
    // Switch to bot's channel to send command
    radio.setGroup(botChannel)
    
    // Send command
    serial.writeLine("* NDM SEND: Ch=" + botChannel + " Cmd=" + command)
    radio.sendString(command)
    
    // Switch back to NDM channel 255 to receive telemetry
    radio.setGroup(network_GroupChannel_NetworkDeviceManager_Base0_Int)
    
    serial.writeLine("* NDM: Switched back to Ch 255")
    
    // Debug output
    if (_debug_Show_Priority_Hi_Bool) {
        serial.writeLine("* NDM DEBUG: Bot=" + configBotId + " BotCh=" + botChannel + " Cmd=" + command)
    }
}
// Render bot configuration page (Page 3+)
function renderBotConfigPage () {
    // Purple background
    scene.setBackgroundColor(11)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    
    // Title bar
    let titleText = "CONFIG: " + configBotId
    let configTitle = textsprite.create(titleText, 0, 1)
    configTitle.setMaxFontHeight(5)
    configTitle.setPosition(80, 8)
    
    // Page number
    let pageNumText = "[" + (currentPage + 1) + "/...]"
    let configPageNum = textsprite.create(pageNumText, 0, 5)
    configPageNum.setMaxFontHeight(5)
    configPageNum.setPosition(145, 8)
    
    // Display configuration parameters
    let yPosConfig = 25
    for (let i = 0; i < configParam_DisplayNames_ArrayOfText.length; i++) {
        let paramLine = configParam_DisplayNames_ArrayOfText[i] + ": " + configParam_Values_Now_ArrayOfNum[i]
        
        // Highlight selected parameter
        let paramColor = 15  // White (default)
        if (i == selectedParamIndex) {
            paramLine = "> " + paramLine
            paramColor = 8  // Cyan (selected)
        } else {
            paramLine = "  " + paramLine
        }
        
        let paramText = textsprite.create(paramLine, 0, paramColor)
        paramText.setMaxFontHeight(5)
        paramText.setPosition(80, yPosConfig)
        yPosConfig += 10
    }
    
    // Debug status row (bottom, above navigation)
    if (debugStatusText != "") {
        //// jwc 26-0123-0630 black font \/ let debugStatus = textsprite.create(debugStatusText, 0, 15)  // White color for better visibility
        let debugStatus = textsprite.create(debugStatusText, 0, 1)  // White color for better visibility
        debugStatus.setMaxFontHeight(5)
        debugStatus.setPosition(80, 102)
    }
    
    // Navigation text
    let configNav = textsprite.create("Up/Dn:Select L/R:Edit A:Send B:Back", 0, 7)
    configNav.setMaxFontHeight(5)
    configNav.setPosition(80, 112)
}
// Fill bot data from parsed key-value pairs
function doScoreboard_BotSingle_ArrayListOfText_Fill_Fn () {
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
// Pad field with spaces to fixed width, use "-" for empty values
function padField (value: string, width: number) {
    if (!(true) || value == "" || value == "0") {
        // Use "-" for empty/zero values
        result = "-"
    } else {
        result = value
    }
    // Manual padding with spaces to reach desired width
    while (result.length < width) {
        result = "" + result + " "
    }
    return result
}
// ============================================================================
// PHASE 2B: REMOTE CONFIGURATION VARIABLES
// ============================================================================
let page1_selectedBotIndex = -1  // -1 = no selection, 0+ = bot index
let page2_selectedBotIndex = 0   // For Page 2 telemetry selection
let selectedParamIndex = 0       // Which parameter is selected on config page
let configBotId = ""             // Bot ID being configured

// Configuration parameter names (10 total) - matches bot/controller code
let configParam_FieldNames_ArrayOfText = [
    "groupChanl",
    "motorFwd",
    "motorBwd",
    "motorTurn",
    "turboFwd",
    "turboBwd",
    "turboTurn",
    "servoMin",
    "servoMax",
    "servoInc"
]

// Configuration display names for UI
let configParam_DisplayNames_ArrayOfText = [
    "Group Channel",
    "Motor Forward %",
    "Motor Backward %",
    "Motor Turn %",
    "Turbo Forward %",
    "Turbo Backward %",
    "Turbo Turn %",
    "Servo Min Deg",
    "Servo Max Deg",
    "Servo Inc Deg"
]

// Current configuration values (defaults matching bot/controller)
let configParam_Values_Now_ArrayOfNum = [1, 60, 60, 50, 90, 90, 80, 0, 220, 15]

// Min/Max ranges for each parameter
let configParam_Values_Min_ArrayOfNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
let configParam_Values_Max_ArrayOfNum = [99, 100, 100, 100, 100, 100, 100, 220, 220, 45]

let result = ""
let keyvaluepair_value = ""
let keyvaluepair_key = ""
let maxOffset = 0
let nav2: TextSprite = null
let info2: TextSprite = null
let pageNum2: TextSprite = null
let title2: TextSprite = null
let scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D: string[] = []
let scoreboard_Bot_Found_Bool = false
let network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str = ""
let network_DataPacket_Rcvd_MessageHeader_Key_AsBotId_Str = ""
let network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList: string[] = []
let nav3: TextSprite = null
let freezeText: TextSprite = null
let botCount: TextSprite = null
let ch: TextSprite = null
let yPos2 = 0
let pageNum3: TextSprite = null
let title3: TextSprite = null
let scoreboard_ColumnBackend_FieldNames_ArrayListOfText: string[] = []
let scoreboard_ColumnFrontend_TitleNames_ArrayListOfText: string[] = []
let network_DataPacket_Rcvd_FieldNames_ArrayListOfText: string[] = []
let _codeComment_AsText = ""
let nextPage = 0
let prevPage = 0
let nav: TextSprite = null
let navText = ""
let botText: TextSprite = null
let color = 0
let botLine = ""
let cycle_Current_Int = 0
let age = 0
let header: TextSprite = null
let headerText = ""
let yPos = 0
let pageNum: TextSprite = null
let title: TextSprite = null
let isScrollPaused = 0
let currentPage = 0
let temp: string[] = []
let cycle2 = 0
let cycle1 = 0
let _debug_Show_Priority_Lo_Bool = false
let _debug_Show_Priority_Hi_Bool = false
let scoreboard_Server_SerialPrint_RawScores_Bool = false
let network_GroupChannel_MyBotAndController_Base0_Int = 0
let LINE_HEIGHT = 0
let TOTAL_PAGES = 0
// Scoreboard/NDM Data Structures
let scoreboard_BotsAll_ArrayListOfText_2D: string[][] = []
let network_DataPacket_Rcvd_Str = ""
let scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = false
// Display Scrolling (for Page 1)
let scrollOffset = 0
let MAX_CONSOLE_LINES = 0
// Debug status text for OLED display
let debugStatusText = ""
TOTAL_PAGES = 3
// Number of bot rows visible on screen
MAX_CONSOLE_LINES = 7
LINE_HEIGHT = 12
// Show welcome splash
game.splash("MicroBit NDM", "Network Device Manager")
game.splash("Use A/B to navigate", "Logo to freeze")
// Initialize
// 'S' = 'S'erver
// ScoreBoard_Server
// Constant Channel # for Master Server, which Receives Everyone's Score. Use 255 vs 0, since 0 could be easily not used by normal users
let network_GroupChannel_ScoreboardServer_BASE0_INT = 255
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
forever(function () {
    _codeComment_AsText = "v0.1.x"
})
// Refresh display every 500ms if on page 1 and not paused
game.onUpdateInterval(500, function () {
    if (currentPage == 0 && isScrollPaused == 0) {
        renderPage1_LiveMonitor()
    }
})
// Increment global cycle counter every 100ms
game.onUpdateInterval(100, function () {
    cycle_Current_Int += 1
})
