namespace webapi;

public class AuthResult
{
    public bool IsAuthenticated  { get; set; }

    public string? Error { get; set; }
}
