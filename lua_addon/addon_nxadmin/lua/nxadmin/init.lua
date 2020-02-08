NxAdmin = NxAdmin or {}

function NxAdmin.getPlayers() 
    local players = {}
    for k, v in pairs(player.GetAll()) do
        if (v.IsPlayer()) then
            players[k] = {
                name = v:Nick(),
                steamid64 = v:SteamID64(),
            }
        end
    end
    return util.TableToJSON(players)
end

function NxAdmin.getBans()
    local i, bans = 0, {}
    for k, v in pairs(ULib.bans) do
        i = i + 1
        bans[i] = {
            steamID = v.steamID,
            admin = v.admin,
            unban = v.unban,
            time = v.time,
            reason = v.reason
        }
    end 
    return util.TableToJSON(bans)
end

function NxAdmin.QueryData(ply, cmd, args) 
    if (ply.IsPlayer()) then return end

    local data;
    if (args[1]) then
        if (args[1] == "players") then
            data = NxAdmin.getPlayers()
        elseif (args[1] == "bans") then
            data = NxAdmin.getBans() 
        end
    end

    print(data)
end 

concommand.Add("querydata", NxAdmin.QueryData, true)