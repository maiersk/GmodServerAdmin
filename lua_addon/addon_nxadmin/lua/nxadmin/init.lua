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

function NxAdmin.GetSteamIDByNick(ply, cmd, args)
    local name = args[1]
    local targetply
    for k, ply in pairs(player.GetAll()) do
        if (ply:Nick() == name) then
            targetply = ply
        end
    end

    print(targetply.SteamID64())
end

concommand.Add("steamidbynick", NxAdmin.GetSteamIDByNick, true)

function NxAdmin.BanByPlayerNick(ply, cmd, args)
    local name = args[1]
    local time = args[2] or 0
    local reason = args[3] or " "
    local banply
    
    if (type(time) == "string") then
        time = ULib.stringTimeToMinutes( time );
    end

    for k, ply in pairs(player.GetAll()) do
        if (ply:Nick() == name) then
            banply = ply
        end
    end

    if (banply) then
        ULib.queueFunctionCall( ULib.kickban, banply, time, reason )
        print(banply:SteamID64())
    end
end 

concommand.Add("banbynick", NxAdmin.BanByPlayerNick, true)
