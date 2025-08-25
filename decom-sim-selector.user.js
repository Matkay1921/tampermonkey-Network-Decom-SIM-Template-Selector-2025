// ==UserScript==
// @name         Network Decom SIM Template Selector 2025
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Add template selector for Network Decom SIM ticket correspondence with auto-activation
// @author       nyariell
// @author       matkay
// @match        https://issues.amazon.com/issues/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/nyariell/tampermonkey-Network-Decom-SIM-Template-Selector-2025/main/decom-sim-selector.user.js
// @downloadURL  https://raw.githubusercontent.com/nyariell/tampermonkey-Network-Decom-SIM-Template-Selector-2025/main/decom-sim-selector.user.js
// ==/UserScript==

(function() {
'use strict';

const allTemplates = {
    "Operator": {
        "Physical Verify": {
            title: "Physical Verification",
            text: "Physical verification completed:\n\nTechs arrived and verified the following.\nRack Name: \nRack Asset: \nRack Location: \nOperator: \nVerifier: \nBoost Workflow: \n\nA flashing LED light has been mounted at the top of the rack for easy identification. The rack has been marked with red tape that displays both the ticket number and Boost WF number."
        },
        "Power Down": {
            title: "Power Down Complete",
            text: "Completed by tech:\nWhip disconnect WF: \nPower down tt: \nPower down successfully completed."
        },
        "DCEO Pending": {
            title: "Power Down DCEO Pending",
            text: "Pending DCEO Action:\nWhip disconnect pending DCEO action.\nPower down tt: "
        },
        "Full Rack B&T": {
            title: "Full Rack B&T",
            text: "Rack secured per Global/Rack Decom Bag and Tag SOP\nRack asset: \nRack liquidation: \nSecurity seal applied: \nLocation: \nReady for Winston Wolfe transfer"
        },
        "Media B&T": {
            title: "Rack with Media B&T",
            text: "Rack secured per Global/Rack Decom Bag and Tag SOP\nRack asset: \nRack liquidation: \nSecurity seal applied: \nNW Media label: \nLocation: \nReady for Winston Wolfe transfer"
        },
        "Pallet B&T": {
            title: "Palletized Equipment",
            text: "Pallet wrapped per SOP requirements\n\nBuild ID: \nRack asset: \nRack liquidation: \nSecurity seals applied: \nEquipment list: \nLocation: \nReady for Winston Wolfe transfer"
        },
        "TopGun Request": {
            title: "TopGun Approval Request",
            text: "TopGun Approval Request:\nDevice name: \nNSM link: \nSerial: "
        },
        "TopGun Complete": {
            title: "TopGun Completion",
            text: "TopGun decommissioning completed\nStatus changed to DECOMMISSIONED\nNo alarms generated\nVerification link: "
        },
        "WDM Passive": {
            title: "WDM Passive Ticket",
            text: "Passive tracking ticket created\nTicket link: \nMonitoring optical queues for impact"
        },
        "Console Verify": {
            title: "Console Verification",
            text: "Console status verified\nNSM Link: \nStatus: DECOMMISSIONED\nProceeding with physical work"
        },
        "Status Mismatch": {
            title: "Status Mismatch",
            text: "Status mismatch identified\nDevice: \nNSM Status: DECOMMISSIONED\nNSM Link: \nProceeding with decommissioning based on NSM verification"
        },
        "Location Mismatch": {
            title: "Location Mismatch",
            text: "Location mismatch identified\nDevice: \nSystem Location: \nPhysical Location: \nInvestigation:\n- Happoshu link: \n- InfraDB link: \nScreenshot of error message attached\nProceeding based on physical verification and device status"
        },
        "Misplaced Device": {
            title: "Misplaced Device",
            text: "Misplaced device identified\nDevice: \nPhysical Location: \nNSM Status: DECOMMISSIONED\nNSM Link: \nScreenshot of location mismatch attached\nProceeding with decommissioning based on physical verification and NSM status"
        },
        "No Serial": {
            title: "No Serial Found",
            text: "Unable to verify device serial\nDevice Type: \nPosition in Rack: \nLabel Reading: \nDevice Model: \nDevice Asset: \nDevice Name: \nEscalating to TIPM for verification"
        },
        "Unidentified Equipment": {
            title: "Unidentified Equipment",
            text: "Unauthorized equipment found\nLocation: \nSerial Number: \nCurrent Lifecycle Status: \nEscalated to TIPM"
        },
        "Alarm Response": {
            title: "Alarm Response",
            text: "Sev[X] alarm detected:\n- Location: \n- Work halted\n- Alarm details: \n- DCO notified: "
        },
        "Escalate to TIPM": {
            title: "Escalate to TIPM",
            text: "Issue: \nImpact: \nStatus: \nTeams engaged: \nEscalated to TIPM"
        }
    },
    "Verifier": {
        "Verify Physical": {
            title: "Verifier Physical Verification",
            text: "Verifier confirms\n\nPhysical verification completed:\n\nTechs arrived and verified the following.\nRack Name: \nRack Asset: \nRack Location: \nOperator: \nVerifier: \nBoost Workflow: \n\nA flashing LED light has been mounted at the top of the rack for easy identification. The rack has been marked with red tape that displays both the ticket number and Boost WF number.",
            nextStep: "Isolation from network/power"
        },
        "Verify Power": {
            title: "Verifier Power Down",
            text: "Verifier confirms\n\nCompleted by tech:\nWhip disconnect WF: \nPower down tt: \nPower down successfully completed.",
            nextStep: "Prepare for WW"
        },
        "Verify Full Rack": {
            title: "Verifier Full Rack B&T",
            text: "Verifier confirms\n\nRack secured per Global/Rack Decom Ba Bag and Tag SOP\nRack asset: \nRack liquidation: \nSecurity seal applied: \nLocation: \nReady for Winston Wolfe transfer",
            nextStep: "Ship to WW"
        },
        "Verify Media": {
            title: "Verifier Rack with MediaB&T",
            text: "Verifier confirms\n\nRack secured per Global/Rack Decom Bag and Tag SOP\nRack asset: \nRack liquidation: \nSecurity seal applied: \nNW Media label: \nLocation: \nReady for Winston Wolfe transfer",
            nextStep: "Ship to WW"
        },
        "Verify Pallet": {
            title: "Verifier Palletized Equipment B&T",
            text: "Verifier confirms\n\nPallet wrapped per SOP requirements\n\nBuild ID: \nRack asset: \nRack liquidation: \nSecurity seals applied: \nEquipment list: \nLocation: \nReady for Winston Wolfe transfer",
            nextStep: "Ship to WW"
        },
        "Verify TopGun": {
            title: "Verifier TopGun Complete",
            text: "Verifier confirms\n\nTopGun decommissioning completed\nStatus changed to DECOMMISSIONED\nNo alarms generated\nVerification link: "
        },
        "Verify Status": {
            title: "Verifier Status Mismatch",
            text: "Verifier confirms\n\nStatus mismatch identified\nDevice: \nNSM Status: DECOMMISSIONED\nNSM Link: \nProceeding with decommissioning based on NSM verification"
        },
        "Verify Location": {
            title: "Verifier Location Mismatch",
            text: "Verifier confirms\n\nLocation mismatch identified\nDevice: \nSystem Location: \nPhysical Location: \nInvestigation:\n- Happoshu link: \n- InfraDB link: \nScreenshot of error message attached\nProceeding based on physical verification and device status"
        },          
        "Verify Alarm": {
            title: "Verifier Alarm Response",
            text: "Verifier confirms\n\nSev[X] alarm detected:\n- Location: \n- Work halted\n- Alarm details: \n- DCO notified: "
         }
    }
};

function updateNextStep(nextStepValue) {
    console.log('Attempting to update next step to:', nextStepValue);

    // Find and check the checkbox
    const checkbox = document.querySelector('input[data-link="convoSetNextStep"]');
    if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        checkbox.click();
    }

    // Wait for the dropdown to appear
    setTimeout(() => {
        // Find the select element
        const nextStepSelect = document.querySelector('#issue-conversation-next-step select');
        if (nextStepSelect) {
            // Find the specific option we want
            const options = Array.from(nextStepSelect.options);
            const targetOption = options.find(option => option.text === nextStepValue);
            
            if (targetOption) {
                // Set the value
                nextStepSelect.value = targetOption.value;
                
                // Simulate a user selection
                targetOption.selected = true;
                
                // Trigger multiple events to ensure the change is registered
                ['change', 'input', 'click'].forEach(eventType => {
                    nextStepSelect.dispatchEvent(new Event(eventType, { bubbles: true }));
                });
                
                // Also try dispatching a jQuery change event if jQuery is available
                if (window.jQuery) {
                    jQuery(nextStepSelect).trigger('change');
                }
            }
        }
    }, 200); // Wait 200ms for the dropdown to appear
}

function createDropdown(templates, labelText) {
    const container = document.createElement('span');
    container.style.marginRight = '10px';

    const select = document.createElement('select');
    select.style.marginRight = '5px';
    select.style.minWidth = '300px';

    const defaultOption = document.createElement('option');
    defaultOption.text = labelText;
    defaultOption.value = '';
    select.appendChild(defaultOption);

    for (const [key, template] of Object.entries(templates)) {
        const option = document.createElement('option');
        option.value = key;
        option.text = `${key} - ${template.title}`;
        select.appendChild(option);
    }

    const button = document.createElement('button');
    button.textContent = 'Insert';
    button.className = 'btn btn-primary';
    button.style.marginLeft = '5px';
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        if (select.value) {
            const template = templates[select.value];
            const textarea = document.getElementById('issue-conversation');
            if (textarea) {
                textarea.value += (textarea.value ? '\n\n' : '') + template.text;
                textarea.focus();
                
                // Update next step based on template
                if (template.nextStep) {
                    updateNextStep(template.nextStep);
                }
                
                select.value = '';
            }
        }
    });

    container.appendChild(select);
    container.appendChild(button);
    return container;
}

function addTemplateSelectors() {
    const targetArea = document.querySelector('#issue-conversation-next-step .form-inline span');
    if (!targetArea) return;

    const selectorsContainer = document.createElement('div');
    selectorsContainer.style.marginTop = '10px';

    for (const [category, templates] of Object.entries(allTemplates)) {
        selectorsContainer.appendChild(createDropdown(templates, `Select ${category} Template...`));
    }

    targetArea.appendChild(selectorsContainer);
}

function init() {
    const checkInterval = setInterval(function() {
        if (document.querySelector('#issue-conversation-next-step')) {
            addTemplateSelectors();
            clearInterval(checkInterval);
        }
    }, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
